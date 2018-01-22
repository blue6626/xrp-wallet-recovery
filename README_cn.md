# Ripple (XRP) 钱包恢复工具
本工具根据用户提供的字符集生成所有可能的密码对钱包进行暴力破解。

## 前提条件
1. 钱包文件
	如果你没有钱包文件，那么本工具不适合你。如果你拥有私钥，那么你可以通过导入私钥的方式创建新的钱包。
2. 密码使用的字符比较少
	如果你的密码包含特殊字符、大小写字母、数字，那么本工具不适合你。
3. 密码的长度比较短
	如果你的密码长度超过8个字符，那么本工具不适合你。
4. 密码存在生成模板
	如果你的密码存在生成模板，比如说字母(先)+数字(后)或者特殊字符(先)+字母(后)，那么本工具能够利用这点加快破解 。

## 安全性
- 本工具在[GitHub](https://github.com/edward852/xrp-wallet-recovery "GitHub")上开放源代码，大家可以审查、监督
- 本工具正确安装后可以离线运行

## 安装
请先安装[git](https://git-scm.com/downloads "git")和[nodejs](https://nodejs.org/en/download/ "nodejs")，然后通过以下命令安装：

```bash
$ git clone https://github.com/edward852/xrp-wallet-recovery.git
$ cd xrp-wallet-recovery
$ npm install
```

## 示例
本工具源码目录下有一个测试用的钱包(testWallet.txt)，默认配置下大家可以通过以下命令进行破解：

```bash
$ node start-recovery.js
```

![](https://raw.githubusercontent.com/edward852/xrp-wallet-recovery/master/decrypted_blob.jpg)
从上图可知，该钱包的密码是qwer123，图中masterkey就是私钥，可以通过导入私钥的方式创建新的钱包。
另外破解成功还会生成password.txt和decrypted-blob.txt两个文件。

## 使用
1. 把你的钱包文件拷贝到本工具目录下
2. 修改config.json文件(见下一节说明)
3. 运行本工具

```bash
$ node start-recovery.js
```

## 配置文件说明
config.json的具体配置见下面的注释：

```javascript
{
    "wallet": "testWallet.txt",                                     // 钱包文件名
    "chars": [                                                              // 密码使用到的字符
        "eqrw",
        "123"
    ],
    "min": 7,                                                              // 密码最小长度
    "max": 7,                                                             // 密码最大长度
    "caseIdx": 0,                                                        // 索引，保存破解进度，初始值为0
    "mailNotify": false,                                              // 破解成功后是否邮件通知(默认关闭)。开启的话需要填写下面的mail字段信息。
    "mail": {
        "host": "smtp.163.com",                                  // 邮箱SMTP服务器地址
        "port": 465,                                                      // 邮箱SMTP服务端口
        "usr": "xrp_wallet_decrypt",                             // 用于发送邮件通知帐号的用户名
        "pwd": "m5Qq2pRovgMf",                              // 用于发送邮件通知帐号的密码或者授权码(比如说163邮箱)
        "sender": "xrp_wallet_decrypt@163.com",      // 用于发送邮件通知的邮箱地址
        "receiver": "edward852@163.com",                // 用于接收邮件通知的邮箱地址
        "secure": true                                                   // 是否使用https(推荐)
    }
}
```

注意配置文件要符合[JSON](http://json.org/ "JSON")格式，特别是字符串要用英文的双引号括起来。
`chars`的设置可以是字符串或者是字符串数组，后者隐含先后关系。
比如说你的密码是类似于qwer123这种字母(先)+数字(后)，那么应该这么设置：

```javascript
"chars": [                                                              // 密码使用到的字符
        "eqrw",                                                        // 字母在前
        "123"                                                           // 数字在后
    ]
```

如果是类似于123qwer这种数字(先)+字母(后)，那么应该这么设置：

```javascript
"chars": [                                                              // 密码使用到的字符
        "123",                                                          // 数字在前
        "eqrw"                                                         // 字母在后
    ]
```

如果并没有这种先后关系比如说q1w2e3r，那么应该这么设置：

```javascript
"chars":  "eqrw123",                                            // 字母和数字混合
```

如果你的密码存在这样的先后关系，那么请根据上面的说明设置好`chars`，以便加快破解速度(提升比较明显)。
另外需要注意区分大小写字母：

```javascript
"chars": "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
```

## 性能优化
可以通过以下手段加快破解速度：
- 提高进程优先级
	对于Linux或者macOS系统用户，可以通过nice或者renice命令提高本工具对应进程的优先级，加快破解。
- 使用云服务
	可以使用配置更高的服务器挂机破解，比如说AWS云服务。

## 常见问题解答
- 这个工具是否安全？
	见上面"安全性"章节的说明
- 为什么破解需要这么久？
	本工具采用的是暴力破解，你的密码越长、使用字符越多则需要穷举的情况就越多

如果还有其他疑问可以给我发邮件(edward852@163.com)。

## 打赏
如果本工具对你有用，请考虑打赏XRP，我的Ripple(XRP)钱包地址是：

![](https://github.com/edward852/xrp-wallet-recovery/raw/master/donation.png)
r9qckT7cFPzW55hVr585JZ8KnuJo8X3Ljv

## License
MIT License.
如果转载，请注明作者(edward852)和出处。