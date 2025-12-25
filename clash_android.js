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
  "https://8.8.4.4/dns-query", // GoogleDNS  
  "https://208.67.222.222/dns-query", // OpenDNS
  "https://77.88.8.8/dns-query", //YandexDNS
  "https://1.1.1.1/dns-query", // CloudflareDNS
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
    "RULE-SET:fake_ip_filter_text"
  ],
  "default-nameserver": ["223.5.5.5", "8.8.4.4"], //可修改成自己ISP的DNS
  "nameserver": [...foreignNameservers],
  "proxy-server-nameserver": [...domesticNameservers],
  "direct-nameserver": [...domesticNameservers],
  "nameserver-policy": {
    "geosite:private,cn": domesticNameservers,
    "geosite:geolocation-!cn": foreignNameservers,
    // "geosite:apple": domesticNameservers, // Apple可以走国内dns
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
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png"
  },
  {
    ...groupBaseOption,
    "name": "AUTO",
    "type": "url-test",
    "include-all": true,
    "tolerance": 50,
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Speedtest.png"
  },
  {
    ...groupBaseOption,
    "name": "🇭🇰 | 香港 HK",
    "type": "url-test",
    "include-all": true,
    "filter": "香港|HK|🇭🇰",
    "tolerance": 50,
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png"
  },
  {
    ...groupBaseOption,
    "name": "🇹🇼 | 台湾 TW",
    "type": "url-test",
    "include-all": true,
    "filter": "台湾|TW|🇹🇼",
    "tolerance": 50,
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png"
  },
  {
    ...groupBaseOption,
    "name": "🇯🇵 | 日本 JP",
    "type": "url-test",
    "include-all": true,
    "filter": "日本|JP|🇯🇵",
    "tolerance": 50,
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Japan.png"
  },
  {
    ...groupBaseOption,
    "name": "🇰🇷 | 韩国 KR",
    "type": "url-test",
    "include-all": true,
    "filter": "韩国|KR|🇰🇷",
    "tolerance": 50,
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Korea.png"
  },
  {
    ...groupBaseOption,
    "name": "🇺🇸 | 美国 US",
    "type": "url-test",
    "include-all": true,
    "filter": "美国|US|🇺🇸",
    "tolerance": 50,
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_States.png"
  },
  {
    ...groupBaseOption,
    "name": "🇩🇪 | 德国 DE",
    "type": "url-test",
    "include-all": true,
    "filter": "德国|DE|🇩🇪",
    "tolerance": 50,
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Germany.png"
  },
  {
    ...groupBaseOption,
    "name": "🇸🇬 | 新加坡 SG",
    "type": "url-test",
    "include-all": true,
    "filter": "新加坡|SG|🇸🇬",
    "tolerance": 50,
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Singapore.png"
  },
  {
    ...groupBaseOption,
    "name": "🇫🇷 | 法国 FR",
    "type": "url-test",
    "include-all": true,
    "filter": "法国|FR|🇫🇷",
    "tolerance": 50,
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/France.png"
  },
  {
    ...groupBaseOption,
    "name": "🇬🇧 | 英国 UK",
    "type": "url-test",
    "include-all": true,
    "filter": "英国|GB|🇬🇧",
    "exclude-filter": "Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置",
    "tolerance": 50,
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_Kingdom.png"
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
const ip_mrs = {
  "type": "http",
  "behavior": "ipcidr",
  "format": "mrs",
  "interval": 86400,
  "proxy": "Proxy"
};

const domain_mrs = {
  "type": "http",
  "behavior": "domain",
  "format": "mrs",
  "interval": 86400,
  "proxy": "Proxy"
};

const domain_text = {
  "type": "http",
  "behavior": "domain",
  "format": "text",
  "interval": 86400,
  "proxy": "Proxy"
};

const class_yaml = {
  "type": "http",
  "behavior": "classical",
  "format": "yaml",
  "interval": 86400,
  "proxy": "Proxy"
};

const ruleProviders = {
  "applications": {
    ...class_yaml,
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt",
    "path": "./ruleset/loyalsoldier/applications.yaml"
  },
  "private_domain": {
    ...domain_mrs,
    "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/private.mrs",
    "path": "./ruleset/meta-rules-dat/geosite/private.mrs"
  },
  "fake_ip_filter_text": {
    ...domain_text,
    "url": "https://raw.githubusercontent.com/juewuy/ShellCrash/refs/heads/dev/public/fake_ip_filter.list",
    "path": "./ruleset/meta-rules-dat/list/fake_ip_filter.list"
  },
  "private_ip": {
    ...ip_mrs,
    "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/private.mrs",
    "path": "./ruleset/meta-rules-dat/geoip/private.mrs"
  },
  "cn_domain": {
    ...domain_mrs,
    "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.mrs",
    "path": "./ruleset/meta-rules-dat/geosite/cn.mrs"
  },
  "cn_ip": {
    ...ip_mrs,
    "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.mrs",
    "path": "./ruleset/meta-rules-dat/geoip/cn.mrs"
  },
  "geolocation-!cn_domain": {
    ...domain_mrs,
    "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/geolocation-!cn.mrs",
    "path": "./ruleset/meta-rules-dat/geosite/geolocation-!cn.mrs"
  },
  "tld-cn_domain": {
    ...domain_mrs,
    "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/tld-cn.mrs",
    "path": "./ruleset/meta-rules-dat/geosite/tld-cn.mrs"
  },
  "xiaomi-ads_domain": {
    ...domain_mrs,
    "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/xiaomi-ads.mrs",
    "path": "./ruleset/meta-rules-dat/geosite/xiaomi-ads.mrs"
  },
  "google-ads_domain": {
    ...domain_mrs,
    "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google-ads.mrs",
    "path": "./ruleset/meta-rules-dat/geosite/google-ads.mrs"
  },
  "telegram_ip": {
    ...ip_mrs,
    "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/telegram.mrs",
    "path": "./ruleset/meta-rules-dat/geoip/telegram.mrs"
  }
};

// 规则（来自 clash_no_specialApp.yaml 第11部分）
const rules = [
  // 本地绕行
  "RULE-SET,fake_ip_filter_text,GlobalDirect",
  "RULE-SET,private_ip,GlobalDirect,no-resolve",
  "RULE-SET,private_domain,GlobalDirect",
  "RULE-SET,applications,GlobalDirect",

  // 广告拦截
  "RULE-SET,xiaomi-ads_domain,GlobalBlock",
  "RULE-SET,google-ads_domain,GlobalBlock",

  // 地区分流与兜底
  "RULE-SET,tld-cn_domain,GlobalDirect",
  "RULE-SET,geolocation-!cn_domain,Proxy",
  "RULE-SET,cn_domain,GlobalDirect",

  // 最终 IP 规则
  "RULE-SET,telegram_ip,GlobalDirect,no-resolve",
  "RULE-SET,cn_ip,GlobalDirect,no-resolve",
  "MATCH,Proxy"
];