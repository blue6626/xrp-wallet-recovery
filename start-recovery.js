'use strict';

const util = require('util');
const atob = require('atob');
const btoa = require('btoa');
const fs = require('mz/fs');
const asmCrypto = require('./asmcrypto.js/asmcrypto.all.js');
const nodemailer = require('nodemailer');
const ProgressBar = require('progress');
const Bruteforcer = require('bruteforcer');

const cfgDef = {
	wallet: 'testWallet.txt',
	chars: ['eqrw','123'],
	min: 7,
	max: 7,
	caseIdx: 0,
	mailNotify: false,							// whether to send email notification or not
	mail: {
		host: 'smtp.163.com',					// smtp server
		port: 465,								// smtp service port
		usr: 'xrp_wallet_decrypt',				// user name
		pwd: 'm5Qq2pRovgMf',					// password or authorization code
		sender: 'xrp_wallet_decrypt@163.com',	// sender email address
		receiver: 'edward852@163.com',			// receiver to be notified
		secure: true							// https or http
	}
};
let cfgJson = cfgDef;

const cfgFile = 'config.json';
let bf = {};
let interrupted = false;

function asmCryptoDecrypt(pwd, data)
{
	const p = JSON.parse(data);

	const iter = p.iter;
	const ks = p.ks;
	const ts = p.ts;

	const salt = asmCrypto.string_to_bytes(atob(p.salt));
	const iv = asmCrypto.string_to_bytes(atob(p.iv));
	const adata = asmCrypto.string_to_bytes(atob(p.adata));
	const ct = asmCrypto.string_to_bytes(atob(p.ct));

	const key = asmCrypto.PBKDF2_HMAC_SHA256.bytes(pwd, salt, iter, ks/8);

	let L;
	const ivl = iv.length;
	const ol = ct.length - ts/8;

	for (L=2; L<4 && ol >>> 8*L; L++) {}
	if (L < 15 - ivl) { L = 15-ivl; }
	const nonce = iv.slice(0, (15-L));

	return asmCrypto.AES_CCM.decrypt(ct, key, nonce, adata, ts/8);
}

function testPassword(pwd, data)
{
	try
	{
		return asmCrypto.bytes_to_string(asmCryptoDecrypt(""+pwd.length+'|'+pwd, data));
	}
	catch (e)
	{
		//console.log(e);
		return false;
	}
}

function notifyResultByMail(pwd, blob)
{
	const transporter = nodemailer.createTransport({
        host: cfgJson.mail.host,
        port: cfgJson.mail.port,
        secure: cfgJson.mail.secure,
        auth: {
            user: cfgJson.mail.usr,
            pass: cfgJson.mail.pwd
        },
        greetingTimeout: 60*1000
    });

	const content = util.format('<b>Password<b>: '+pwd+'<br><b>Decrypted Blob<b>:<br>'+blob);
    
    const mailOptions = {
        from: cfgJson.mail.sender,
        to: cfgJson.mail.receiver,
        subject: '[Ripple] Wallet Decrypted',
        html: content
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err)
        {
            return console.log(err);
        }

        console.log('\nNotification sent.');
    });
}

function chkResult(pwd, data, bar, idx)
{
	bar.tick();

	/*
	if (0==(idx%1000))
	{
		bar.interrupt('Current case index: '+idx+' str: '+pwd);
	}
	*/
	
	const blob = testPassword(pwd, data);
	if (blob)
	{
		bar.terminate();
		console.log("Found password:", pwd);
		console.log("Decrypted blob:\n", blob);

		fs.writeFileSync('password.txt', pwd);
		fs.writeFileSync('decrypted-blob.txt', blob);
		if (cfgJson.mailNotify)
		{
			notifyResultByMail(pwd, blob);
		}

		return true;
	}

	if (bar.complete)
	{
		console.log('\nDecryption failed!');
		fs.writeFileSync('decrypt-failed.txt', '');
	}

	return false;
}

process.on('exit', (code) => {
	if (interrupted)
	{
		cfgJson.caseIdx = bf.getCaseIndex();

		// save case index synchronously
		fs.writeFileSync(cfgFile, JSON.stringify(cfgJson, null, 4));
	}
});

function handleSig()
{
	interrupted = true;
	process.exit();
}

process.on('SIGINT', handleSig);
process.on('SIGTERM', handleSig);

(async () => {
	try
	{
		try
		{
			const cfgData = await fs.readFile(cfgFile, 'utf8');
			cfgJson = JSON.parse(cfgData);

		}
		catch (e)
		{
			cfgJson = cfgDef;
		}
		console.log('Your config:\n', JSON.stringify(cfgJson, null, 4));
		
		const walletBase64Data = await fs.readFile(cfgJson.wallet, 'utf8');
		let walletBinaryData = atob(walletBase64Data);

		bf = new Bruteforcer({
				chars: cfgJson.chars, min: cfgJson.min, max: cfgJson.max,
				cbk: (pwd, idx, cases) => chkResult(pwd, walletBinaryData, bar, idx)
			});

		const bar = new ProgressBar('[:percent] :etas left cur::current tot::total',
						{ curr: cfgJson.caseIdx, total: bf.getCaseNumber(), renderThrottle: 1000 });
		bar.start = new Date;	// fix bug of ProgressBar

		// start from last case index
		bf.startFrom(cfgJson.caseIdx);
		
	}
	catch (e)
	{
		console.log(e);
	}
})();
