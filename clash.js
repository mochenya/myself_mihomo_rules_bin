// 多订阅合并，这里添加额外的地址
// const proxyProviders = {
//   "p1": {
//     "type": "http",
//     // 订阅 链接
//     "url": "https://baidu.com",
//     // 自动更新时间 86400(秒) / 3600 = 24小时
//     "interval": 86400,
//     "override": {
//       // 节点名称前缀 p1，用于区别机场节点
//       "additional-prefix": "p1 |"
//     }
//   },
//   "p2": {
//     "type": "http",
//     "url": "https://google.com",
//     "interval": 86400,
//     "override": {
//       "additional-prefix": "p2 |"
//     }
//   },
// }

// 国内DNS服务器
const domesticNameservers = [
  "https://223.5.5.5/dns-query", // 阿里DoH
  "https://doh.pub/dns-query" // 腾讯DoH
];
// 国外DNS服务器
const foreignNameservers = [
  "https://208.67.222.222/dns-query", // OpenDNS
  "https://77.88.8.8/dns-query", //YandexDNS
  "https://1.1.1.1/dns-query", // CloudflareDNS
  "https://8.8.4.4/dns-query", // GoogleDNS  
];

// 程序入口
function main(config) {
  const proxyCount = config?.proxies?.length ?? 0;
  const originalProviders = config?.["proxy-providers"] || {};
  const proxyProviderCount = typeof originalProviders === "object" ? Object.keys(originalProviders).length : 0;

  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error("配置文件中未找到任何代理");
  }

  // 合并而非覆盖
  config["proxy-providers"] = {
    ...originalProviders,  // 保留原有配置
    // ...proxyProviders       // 合并新配置（同名则覆盖）
  };
  // 覆盖原配置中DNS配置
  config["dns"] = dnsConfig;
  // 覆盖原配置中的代理组
  config["proxy-groups"] = proxyGroupConfig;
  // 覆盖原配置中的规则
  config["rule-providers"] = ruleProviders;
  config["rules"] = rules;
  //覆盖通用配置
  // config["mixed-port"] = 7890;
  // config["allow-lan"] = true;
  // config["bind-address"] = "*";
  // config["ipv6"] = true;
  // config["unified-delay"] = true;
  // 返回修改后的配置
  return config;
}

// DNS配置
const dnsConfig = {
  "enable": true,
  "listen": "0.0.0.0:1053",
  "ipv6": false,
  "prefer-h3": false,
  "respect-rules": true,
  "use-system-hosts": false,
  "cache-algorithm": "arc",
  "enhanced-mode": "fake-ip",
  "fake-ip-range": "198.18.0.1/16",
  "fake-ip-filter": [
    // 本地主机/设备
    "+.lan",
    "+.local",
    // // Windows网络出现小地球图标
    "+.msftconnecttest.com",
    "+.msftncsi.com",
    // QQ快速登录检测失败
    "localhost.ptlogin2.qq.com",
    "localhost.sec.qq.com",
    // 追加以下条目
    "+.in-addr.arpa",
    "+.ip6.arpa",
    "time.*.com",
    "time.*.gov",
    "pool.ntp.org",
    // 微信快速登录检测失败
    "localhost.work.weixin.qq.com"
  ],
  "default-nameserver": ["223.5.5.5", "223.6.6.6"], //可修改成自己ISP的DNS
  "nameserver": [...foreignNameservers],
  "proxy-server-nameserver": [...domesticNameservers],
  "direct-nameserver": [...domesticNameservers],
  "nameserver-policy": {
    "geosite:private,cn": domesticNameservers
  }
};

// 代理组通用配置
const groupBaseOption = {
  "interval": 300,
  "timeout": 3000,
  "url": "https://www.gstatic.com/generate_204",
  "max-failed-times": 3,
  "hidden": false
};

// 代理组规则
const proxyGroupConfig = [
  {
    ...groupBaseOption,
    "name": "Proxy",
    "type": "select",
    "proxies": ["AUTO", "🇭🇰 | 香港 HK", "🇹🇼 | 台湾 TW", "🇯🇵 | 日本 JP", "🇰🇷 | 韩国 KR", "🇺🇸 | 美国 US", "🇩🇪 | 德国 DE", "🇸🇬 | 新加坡 SG", "🇫🇷 | 法国 FR", "🇬🇧 | 英国 UK", "DIRECT", "REJECT"],
    "include-all": true,
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png"
  },
  {
    ...groupBaseOption,
    "name": "AUTO",
    "type": "url-test",
    "include-all": true,
    "tolerance": 50,
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Speedtest.png"
  },
  {
    ...groupBaseOption,
    "name": "YouTube",
    "type": "select",
    "proxies": ["Proxy", "🇭🇰 | 香港 HK", "🇹🇼 | 台湾 TW", "🇯🇵 | 日本 JP", "🇰🇷 | 韩国 KR", "🇺🇸 | 美国 US", "🇩🇪 | 德国 DE", "🇸🇬 | 新加坡 SG", "🇫🇷 | 法国 FR", "🇬🇧 | 英国 UK", "DIRECT", "REJECT"],
    "include-all": true,
    "exclude-filter": "(?i)GB|Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置",
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/YouTube.png"
  },
  {
    ...groupBaseOption,
    "name": "Google",
    "type": "select",
    "proxies": ["Proxy", "🇭🇰 | 香港 HK", "🇹🇼 | 台湾 TW", "🇯🇵 | 日本 JP", "🇰🇷 | 韩国 KR", "🇺🇸 | 美国 US", "🇩🇪 | 德国 DE", "🇸🇬 | 新加坡 SG", "🇫🇷 | 法国 FR", "🇬🇧 | 英国 UK", "DIRECT"],
    "include-all": true,
    "exclude-filter": "(?i)GB|Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置",
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Google_Search.png"
  },
  {
    ...groupBaseOption,
    "name": "OpenAI",
    "type": "select",
    "proxies": ["Proxy", "US", "TW", "JP", "KR", "HK", "DE", "SG", "FR", "UK", "DIRECT"],
    "include-all": true,
    "exclude-filter": "(?i)GB|Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置",
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/ChatGPT.png"
  },
  {
    ...groupBaseOption,
    "name": "Claude",
    "type": "select",
    "proxies": ["Proxy", "US", "TW", "JP", "KR", "HK", "DE", "SG", "FR", "UK", "DIRECT"],
    "include-all": true,
    "exclude-filter": "(?i)GB|Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置",
    "icon": "https://cdn.jsdelivr.net/gh/ke1ewang/Qi@master/Claude.png"
  },
  {
    ...groupBaseOption,
    "name": "Telegram",
    "type": "select",
    "proxies": ["Proxy", "🇭🇰 | 香港 HK", "🇹🇼 | 台湾 TW", "🇯🇵 | 日本 JP", "🇰🇷 | 韩国 KR", "🇺🇸 | 美国 US", "🇩🇪 | 德国 DE", "🇸🇬 | 新加坡 SG", "🇫🇷 | 法国 FR", "🇬🇧 | 英国 UK", "DIRECT", "REJECT"],
    "include-all": true,
    "exclude-filter": "(?i)GB|Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置",
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Telegram.png"
  },
  {
    ...groupBaseOption,
    "name": "Twitter",
    "type": "select",
    "proxies": ["Proxy", "🇭🇰 | 香港 HK", "🇹🇼 | 台湾 TW", "🇯🇵 | 日本 JP", "🇰🇷 | 韩国 KR", "🇺🇸 | 美国 US", "🇩🇪 | 德国 DE", "🇸🇬 | 新加坡 SG", "🇫🇷 | 法国 FR", "🇬🇧 | 英国 UK", "DIRECT"],
    "include-all": true,
    "exclude-filter": "(?i)GB|Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置",
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Twitter.png"
  },
  {
    ...groupBaseOption,
    "name": "Spotify",
    "type": "select",
    "proxies": ["Proxy", "🇭🇰 | 香港 HK", "🇹🇼 | 台湾 TW", "🇯🇵 | 日本 JP", "🇰🇷 | 韩国 KR", "🇺🇸 | 美国 US", "🇩🇪 | 德国 DE", "🇸🇬 | 新加坡 SG", "🇫🇷 | 法国 FR", "🇬🇧 | 英国 UK", "DIRECT"],
    "include-all": true,
    "exclude-filter": "(?i)GB|Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置",
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Spotify.png"
  },
  {
    ...groupBaseOption,
    "name": "OneDrive",
    "type": "select",
    "proxies": ["DIRECT", "Proxy", "🇭🇰 | 香港 HK", "🇹🇼 | 台湾 TW", "🇯🇵 | 日本 JP", "🇰🇷 | 韩国 KR", "🇺🇸 | 美国 US", "🇩🇪 | 德国 DE", "🇸🇬 | 新加坡 SG", "🇫🇷 | 法国 FR", "🇬🇧 | 英国 UK"],
    "include-all": true,
    "exclude-filter": "(?i)GB|Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置",
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/OneDrive.png"
  },
  {
    ...groupBaseOption,
    "name": "Microsoft",
    "type": "select",
    "proxies": ["DIRECT", "Proxy", "REJECT", "🇭🇰 | 香港 HK", "🇹🇼 | 台湾 TW", "🇯🇵 | 日本 JP", "🇰🇷 | 韩国 KR", "🇺🇸 | 美国 US", "🇩🇪 | 德国 DE", "🇸🇬 | 新加坡 SG", "🇫🇷 | 法国 FR", "🇬🇧 | 英国 UK"],
    "include-all": true,
    "exclude-filter": "(?i)GB|Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置",
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Microsoft.png"
  },
  {
    ...groupBaseOption,
    "name": "Apple",
    "type": "select",
    "proxies": ["DIRECT", "Proxy", "🇭🇰 | 香港 HK", "🇹🇼 | 台湾 TW", "🇯🇵 | 日本 JP", "🇰🇷 | 韩国 KR", "🇺🇸 | 美国 US", "🇩🇪 | 德国 DE", "🇸🇬 | 新加坡 SG", "🇫🇷 | 法国 FR", "🇬🇧 | 英国 UK", "REJECT"],
    "include-all": true,
    "exclude-filter": "(?i)GB|Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置",
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Apple.png"
  },
  // {
  //   ...groupBaseOption,
  //   "name": "BiliBili",
  //   "type": "select",
  //   "proxies": ["DIRECT", "Proxy", "REJECT", "🇭🇰 | 香港 HK", "🇹🇼 | 台湾 TW", "🇯🇵 | 日本 JP", "🇰🇷 | 韩国 KR", "🇺🇸 | 美国 US", "🇩🇪 | 德国 DE", "🇸🇬 | 新加坡 SG", "🇫🇷 | 法国 FR", "🇬🇧 | 英国 UK"],
  //   "include-all": true,
  //   "exclude-filter": "(?i)GB|Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置",
  //   "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/bilibili.png"
  // },
  // {
  //   ...groupBaseOption,
  //   "name": "TikTok",
  //   "type": "select",
  //   "proxies": ["Proxy", "TW", "HK", "JP", "KR", "US", "DE", "SG", "FR", "UK", "DIRECT"],
  //   "include-all": true,
  //   "exclude-filter": "(?i)GB|Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置",
  //   "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/TikTok.png"
  // },
  // {
  //   ...groupBaseOption,
  //   "name": "Netflix",
  //   "type": "select",
  //   "proxies": ["Proxy", "🇭🇰 | 香港 HK", "🇹🇼 | 台湾 TW", "🇯🇵 | 日本 JP", "🇰🇷 | 韩国 KR", "🇺🇸 | 美国 US", "🇩🇪 | 德国 DE", "🇸🇬 | 新加坡 SG", "🇫🇷 | 法国 FR", "🇬🇧 | 英国 UK", "DIRECT"],
  //   "include-all": true,
  //   "exclude-filter": "(?i)GB|Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置",
  //   "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Netflix.png"
  // },
  // {
  //   ...groupBaseOption,
  //   "name": "Disney",
  //   "type": "select",
  //   "proxies": ["Proxy", "🇭🇰 | 香港 HK", "🇹🇼 | 台湾 TW", "🇯🇵 | 日本 JP", "🇰🇷 | 韩国 KR", "🇺🇸 | 美国 US", "🇩🇪 | 德国 DE", "🇸🇬 | 新加坡 SG", "🇫🇷 | 法国 FR", "🇬🇧 | 英国 UK", "DIRECT"],
  //   "include-all": true,
  //   "exclude-filter": "(?i)GB|Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置",
  //   "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Disney.png"
  // },
  // {
  //   ...groupBaseOption,
  //   "name": "Emby",
  //   "type": "select",
  //   "proxies": ["Proxy", "🇭🇰 | 香港 HK", "🇹🇼 | 台湾 TW", "🇯🇵 | 日本 JP", "🇰🇷 | 韩国 KR", "🇺🇸 | 美国 US", "🇩🇪 | 德国 DE", "🇸🇬 | 新加坡 SG", "🇫🇷 | 法国 FR", "🇬🇧 | 英国 UK", "DIRECT"],
  //   "include-all": true,
  //   "exclude-filter": "(?i)GB|Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置",
  //   "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Emby.png"
  // },
  // {
  //   ...groupBaseOption,
  //   "name": "Steam",
  //   "type": "select",
  //   "proxies": ["Proxy", "HK", "DIRECT", "TW", "JP", "KR", "US", "DE", "SG", "FR", "UK"],
  //   "include-all": true,
  //   "exclude-filter": "(?i)GB|Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置",
  //   "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Steam.png"
  // },
  {
    ...groupBaseOption,
    "name": "🇭🇰 | 香港 HK",
    "type": "url-test",
    "include-all": true,
    "filter": "香港|HK|🇭🇰",
    "tolerance": 50,
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png"
  },
  {
    ...groupBaseOption,
    "name": "🇹🇼 | 台湾 TW",
    "type": "url-test",
    "include-all": true,
    "filter": "台湾|TW|🇹🇼",
    "tolerance": 50,
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png"
  },
  {
    ...groupBaseOption,
    "name": "🇯🇵 | 日本 JP",
    "type": "url-test",
    "include-all": true,
    "filter": "日本|JP|🇯🇵",
    "tolerance": 50,
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Japan.png"
  },
  {
    ...groupBaseOption,
    "name": "🇰🇷 | 韩国 KR",
    "type": "url-test",
    "include-all": true,
    "filter": "韩国|KR|🇰🇷",
    "tolerance": 50,
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Korea.png"
  },
  {
    ...groupBaseOption,
    "name": "🇺🇸 | 美国 US",
    "type": "url-test",
    "include-all": true,
    "filter": "美国|US|🇺🇸",
    "tolerance": 50,
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_States.png"
  },
  {
    ...groupBaseOption,
    "name": "🇩🇪 | 德国 DE",
    "type": "url-test",
    "include-all": true,
    "filter": "德国|DE|🇩🇪",
    "tolerance": 50,
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Germany.png"
  },
  {
    ...groupBaseOption,
    "name": "🇸🇬 | 新加坡 SG",
    "type": "url-test",
    "include-all": true,
    "filter": "新加坡|SG|🇸🇬",
    "tolerance": 50,
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Singapore.png"
  },
  {
    ...groupBaseOption,
    "name": "🇫🇷 | 法国 FR",
    "type": "url-test",
    "include-all": true,
    "filter": "法国|FR|🇫🇷",
    "tolerance": 50,
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/France.png"
  },
  {
    ...groupBaseOption,
    "name": "🇬🇧 | 英国 UK",
    "type": "url-test",
    "include-all": true,
    "filter": "英国|GB|🇬🇧",
    "exclude-filter": "Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置",
    "tolerance": 50,
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_Kingdom.png"
  },
  {
    ...groupBaseOption,
    "name": "GlobalDirect",
    "type": "select",
    "proxies": ["DIRECT", "Proxy"],
    "include-all": true,
    "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/link.svg"
  },
    {
      ...groupBaseOption,
      "name": "GlobalBlock",
      "type": "select",
      "proxies": ["REJECT", "DIRECT"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/block.svg"
    },
];


// 规则集通用配置
const yamlRule = {
  "type": "http",
  "format": "yaml",
  "interval": 86400,
  "proxy": "Proxy"
};

const mrsRule = {
  "type": "http",
  "format": "mrs",
  "interval": 86400,
  "proxy": "Proxy"
};

// 规则集配置
const ruleProviders = {
  "Apple": {
    ...mrsRule,
    "behavior": "domain",
    "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/apple.mrs",
    "path": "./ruleset/apple.mrs"
  },
  "Telegram": {
    ...mrsRule,
    "behavior": "domain",
    "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/telegram.mrs",
    "path": "./ruleset/telegram.mrs"
  },
  "YouTube": {
    ...mrsRule,
    "behavior": "domain",
    "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/youtube.mrs",
    "path": "./ruleset/youtube.mrs"
  },
  // "BiliBili": {
  //   ...yamlRule,
  //   "behavior": "classical",
  //   "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/BiliBili/BiliBili.yaml",
  //   "path": "./ruleset/BiliBili.yaml"
  // },
  // "TikTok": {
  //   ...ruleProviderCommon,
  //   "behavior": "classical",
  //   "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/TikTok/TikTok.yaml",
  //   "path": "./ruleset/TikTok.yaml"
  // },
  "Spotify": {
    ...mrsRule,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@refs/heads/meta/geo/geosite/spotify.mrs",
    "path": "./ruleset/spotify.mrs"
  },
  // "Netflix": {
  //   ...ruleProviderCommon,
  //   "behavior": "classical",
  //   "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Netflix/Netflix.yaml",
  //   "path": "./ruleset/Netflix.yaml"
  // },
  // "Disney": {
  //   ...ruleProviderCommon,
  //   "behavior": "classical",
  //   "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Disney/Disney.yaml",
  //   "path": "./ruleset/Disney.yaml"
  // },
  "Google": {
    ...mrsRule,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@refs/heads/meta/geo/geosite/google.mrs",
    "path": "./ruleset/google.mrs"
  },
  "OpenAI": {
    ...mrsRule,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@refs/heads/meta/geo/geosite/openai.mrs",
    "path": "./ruleset/openai.mrs"
  },
  "Microsoft": {
    ...mrsRule,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@refs/heads/meta/geo/geosite/microsoft.mrs",
    "path": "./ruleset/microsoft.mrs"
  },
  "Twitter": {
    ...yamlRule,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Twitter/Twitter.yaml",
    "path": "./ruleset/Twitter.yaml"
  },
  "Steam": {
    ...mrsRule,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@refs/heads/meta/geo/geosite/steam.mrs",
    "path": "./ruleset/steam.mrs"
  },
  "OneDrive": {
    ...mrsRule,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@refs/heads/meta/geo/geosite/onedrive.mrs",
    "path": "./ruleset/onedrive.mrs"
  },
  // "Emby": {
  //   ...ruleProviderCommon,
  //   "behavior": "classical",
  //   "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Emby/Emby.yaml",
  //   "path": "./ruleset/Emby.yaml"
  // },
  "Claude": {
    ...mrsRule,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@refs/heads/meta/geo/geosite/anthropic.mrs",
    "path": "./ruleset/anthropic.mrs"
  },
  "Github": {
    ...mrsRule,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@refs/heads/meta/geo/geosite/github.mrs",
    "path": "./ruleset/github.mrs"
  },

  // Loyalsoldier
  "proxy": {
    ...yamlRule,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt",
    "path": "./ruleset/loyalsoldier/proxy.yaml"
  },
  "direct": {
    ...yamlRule,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt",
    "path": "./ruleset/loyalsoldier/direct.yaml"
  },
  "private": {
    ...yamlRule,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt",
    "path": "./ruleset/loyalsoldier/private.yaml"
  },
  "gfw": {
    ...yamlRule,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt",
    "path": "./ruleset/loyalsoldier/gfw.yaml"
  },
  "tld-not-cn": {
    ...yamlRule,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt",
    "path": "./ruleset/loyalsoldier/tld-not-cn.yaml"
  },
  "telegramcidr": {
    ...yamlRule,
    "behavior": "ipcidr",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt",
    "path": "./ruleset/loyalsoldier/telegramcidr.yaml"
  },
  "cncidr": {
    ...yamlRule,
    "behavior": "ipcidr",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt",
    "path": "./ruleset/loyalsoldier/cncidr.yaml"
  },
  "lancidr": {
    ...yamlRule,
    "behavior": "ipcidr",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt",
    "path": "./ruleset/loyalsoldier/lancidr.yaml"
  },
  "applications": {
    ...yamlRule,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt",
    "path": "./ruleset/loyalsoldier/applications.yaml"
  },

  // Ads
  "google-ads": {
    ...mrsRule,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@refs/heads/meta/geo/geosite/google-ads.mrs",
    "path": "./ruleset/google-ads.mrs"
  },
};

// 规则
const rules = [
  // Loyalsoldier 规则集
  "RULE-SET,applications,GlobalDirect",
  "RULE-SET,private,GlobalDirect",
  // Loyalsoldier 规则集

  // Ads
  "RULE-SET,google-ads,GlobalBlock",
  
  // 自定义规则
  "RULE-SET,YouTube,YouTube",
  "RULE-SET,Google,Google",
  "RULE-SET,OpenAI,OpenAI",
  "RULE-SET,Claude,Claude",
  "RULE-SET,Telegram,Telegram",
  "RULE-SET,Github,Proxy",
  "RULE-SET,Twitter,Twitter",
  "RULE-SET,Spotify,Spotify",
  "RULE-SET,OneDrive,OneDrive",
  "RULE-SET,Microsoft,Microsoft",
  "RULE-SET,Apple,GlobalDirect",
  // "RULE-SET,BiliBili,BiliBili",
  // "RULE-SET,TikTok,TikTok",
  // "RULE-SET,Netflix,Netflix",
  // "RULE-SET,Disney,Disney",
  // "RULE-SET,Steam,Steam",
  // "RULE-SET,Emby,Emby",
  // 自定义规则

  // Loyalsoldier 规则集
  "RULE-SET,proxy,Proxy",
  "RULE-SET,gfw,Proxy",
  "RULE-SET,tld-not-cn,Proxy",
  "RULE-SET,direct,GlobalDirect",
  "RULE-SET,lancidr,GlobalDirect,no-resolve",
  "RULE-SET,cncidr,GlobalDirect,no-resolve",
  "RULE-SET,telegramcidr,Proxy,no-resolve",
  // Loyalsoldier 规则集

  // 其他规则
  "GEOSITE,CN,GlobalDirect",
  "GEOIP,LAN,GlobalDirect,no-resolve",
  "GEOIP,CN,GlobalDirect,no-resolve",
  "MATCH,Proxy"
  // 其他规则
];