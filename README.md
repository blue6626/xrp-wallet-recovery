# Ripple (XRP) Wallet Recovery Tool
This tool generates all possible candidates based on user-provided characters to brute-force the wallet.  
中文使用说明请看 [这里](https://github.com/edward852/xrp-wallet-recovery/blob/master/README_cn.md "这里") 。

## Prerequisite
1. Wallet file  
If you do not have the wallet file, then this tool is not for you.   
If you have a private/master key, you can create a new wallet by importing the private/secret key.
2. Your password contains only a few possible characters  
If your password contains both special characters, uppercase letters, lowercase letters and numbers, then this tool is not for you.
3. Your password is short  
If your password has more than 8 characters, then this tool is not for you.
4. Your password has a pattern  
This tool can speed up by taking advantage of the pattern.  
For example, your password has a pattern like letters (first) + numbers (after) or special characters (first) + letters (after).

## Safety
- This tool is open-source and you can check it out on [GitHub](https://github.com/edward852/xrp-wallet-recovery "GitHub")
- This tool can run offline without internet connection after installation

## Installation
First you need to install [git](https://git-scm.com/downloads "git") and [nodejs](https://nodejs.org/en/download/ "nodejs").  
After that, enter the following commands:

```bash
$ git clone https://github.com/edward852/xrp-wallet-recovery.git
$ cd xrp-wallet-recovery
$ npm install
```

## Demo
There is a wallet(named testWallet.txt) for testing under the source directory.  
By default, you can start recovery by entering the following command:

```bash
$ node start-recovery.js
```

![](https://raw.githubusercontent.com/edward852/xrp-wallet-recovery/master/decrypted_blob.jpg)  
As can be seen from the figure above, the password is "qwer123" and the private/secret key is the string that starts with "s".  
Then you can create a new wallet by importing the private/secret key.  
Besides, two files named, respectively, password.txt and decrypted-blob.txt, will be generated.

## Usage
1. Copy your wallet file to the source directory
2. Modify config.json(see next section)
3. Start recovery by entering the following command:

```bash
$ node start-recovery.js
```

## Configuration of config.json
See the following comments for user-specific configuration:

```javascript
{
    "wallet": "testWallet.txt",                 // filename of wallet
    "chars": [                                  // characters(a string or an array of strings) used to generate candidates.
        "eqrw",
        "123"
    ],
    "min": 7,                                   // minimum length of the candidate
    "max": 7,                                   // maximum length of the candidate
    "caseIdx": 0,                               // case index indicates the recovery progress. The initial value is 0.
    "mailNotify": false,                        // Whether to send email notification or not after a successful recovery(disabled by default).
                                                // To enable notification, you need to fill in the following "mail" field.
    "mail": {
        "host": "smtp.163.com",                 // SMTP server address
        "port": 465,                            // SMTP service port
        "usr": "xrp_wallet_decrypt",            // username
        "pwd": "m5Qq2pRovgMf",                  // password or authorization code(e.g. NetEase Mail)
        "sender": "xrp_wallet_decrypt@163.com", // email address of sender
        "receiver": "edward852@163.com",        // email address of receiver
        "secure": true                          // Use https or not(recommend)
    }
}
```

Note that the configuration file should conform to the [JSON](http://json.org/ "JSON") format, especially the string should be enclosed in double quotation marks in English.  
The `chars` option can be a string or an array of strings, the latter implicit a particular order.  
If your password(e.g. qwer123) has a pattern like letters (first) + numbers (after), then following setting should be used:

```javascript
"chars": [                                           // characters used to generate candidates.
        "eqrw",                                      // letters(first)
        "123"                                        // numbers(after)
    ]
```

If your password(e.g. 123qwer) has a pattern like numbers (first) + letters (after), then following setting should be used:

```javascript
"chars": [                                           // characters used to generate candidates.
        "123",                                       // numbers(first)
        "eqrw"                                       // letters(after)
    ]
```

If there is no such particular order(e.g. q1w2e3r), then following setting should be used:

```javascript
"chars":  "eqrw123",                                 // mixture of letters and numbers
```

Set `chars` properly if there is such a particular order so as to speed up the recovery process(dramatically boost).  
Besides, you need to pay attention to the case sensitive letters:

```javascript
"chars": "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
```

## Optimization
You can speed up the recovery process by the following means:  
- Higher process priority  
For Linux or macOS system users, you can give the process a higher priority using `nice` or `renice` command.
- Cloud Computing Service  
Use a high performance compute instance.

## FAQ
- Is this tool safe?  
See the "Safety" section above for details.
- Why does the recovery take so long?  
The longer your password could be, the more characters you may used, the more time it will take.  

If there are other questions, you can email me(edward852@163.com).

## Donation
If this tool is useful to you, please consider making a donation. Here is my Ripple (XRP) wallet address:

![](https://github.com/edward852/xrp-wallet-recovery/raw/master/donation.png)  
r9qckT7cFPzW55hVr585JZ8KnuJo8X3Ljv

## License
MIT License.  
Please indicate the author(edward852) and the source, if reproduced.
