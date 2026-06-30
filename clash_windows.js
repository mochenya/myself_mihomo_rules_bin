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
  };
  // 覆盖原配置中DNS配置
  config["dns"] = dnsConfig;
  // 覆盖原配置中的代理组
  config["proxy-groups"] = proxyGroupConfig;
  // 覆盖原配置中的规则
  config["rule-providers"] = ruleProviders;
  config["rules"] = rules;
  // 返回修改后的配置
  return config;
}

// DNS 锚点（可复用的 DNS 服务器地址）
const directDns = [ // 国内 DNS
  "https://223.5.5.5/dns-query",
  "https://doh.pub/dns-query"
];
const foreignDns = [ // 国外 DNS
  "https://1.1.1.1/dns-query",
  "https://8.8.4.4/dns-query"
];
const fallbackDns = [ // 备用 DNS
  "https://1.1.1.1/dns-query",
  "https://1.0.0.1/dns-query",
  "https://8.8.8.8/dns-query",
  "https://8.8.4.4/dns-query"
];
const proxyServerDns = [ // 代理节点域名解析
  "https://223.5.5.5/dns-query",
  "https://119.29.29.29/dns-query"
];

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
    "rule-set:fake_ip_filter_text",
    "rule-set:cn_domain"
  ],
  "default-nameserver": ["223.5.5.5", "8.8.4.4"],
  "nameserver": [...directDns], // 默认 DNS (兜底解析，使用国内 DNS)
  "fallback": [...fallbackDns], // 备用 DNS (当 nameserver 解析失败时尝试)
  "proxy-server-nameserver": [...proxyServerDns], // 代理节点域名解析
  "direct-nameserver": [...directDns], // 直连 DNS (国内域名)
  "nameserver-policy": {
    "rule-set:cn_domain": [...directDns], // 国内域名 → 国内 DNS
    "rule-set:geolocation-!cn_domain": [...foreignDns] // 国外域名 → 国外 DNS
  }
};

// 策略组通用配置
const groupBaseOption = {
  "interval": 1800,
  "lazy": true,
  "timeout": 5000,
  "url": "https://www.gstatic.com/generate_204",
  "max-failed-times": 3
};

// select 类型策略组（手动选择，无需健康检查）
const selectBase = {};

// 地区分组基础配置（继承 groupBaseOption 的健康检查参数）
const regionBase = {
  ...groupBaseOption,
  "type": "url-test",
  "include-all": true,
  "tolerance": 50,
  "exclude-filter": "Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置"
};

// 代理组规则
const proxyGroupConfig = [
  // --- 核心主策略 ---
  {
    ...selectBase,
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
  // --- 地区分组 (自动筛选对应地区节点) ---
  {
    ...regionBase,
    "name": "🇭🇰 | 香港 HK",
    "filter": "香港|HK|🇭🇰",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png"
  },
  {
    ...regionBase,
    "name": "🇹🇼 | 台湾 TW",
    "filter": "台湾|TW|🇹🇼",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png"
  },
  {
    ...regionBase,
    "name": "🇯🇵 | 日本 JP",
    "filter": "日本|JP|🇯🇵",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Japan.png"
  },
  {
    ...regionBase,
    "name": "🇰🇷 | 韩国 KR",
    "filter": "韩国|KR|🇰🇷",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Korea.png"
  },
  {
    ...regionBase,
    "name": "🇺🇸 | 美国 US",
    "filter": "美国|US|🇺🇸",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_States.png"
  },
  {
    ...regionBase,
    "name": "🇩🇪 | 德国 DE",
    "filter": "德国|DE|🇩🇪",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Germany.png"
  },
  {
    ...regionBase,
    "name": "🇸🇬 | 新加坡 SG",
    "filter": "新加坡|SG|🇸🇬",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Singapore.png"
  },
  {
    ...regionBase,
    "name": "🇫🇷 | 法国 FR",
    "filter": "法国|FR|🇫🇷",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/France.png"
  },
  {
    ...regionBase,
    "name": "🇬🇧 | 英国 UK",
    "filter": "英国|GB|🇬🇧",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_Kingdom.png"
  },
  // --- 漏网之鱼与拦截分组 ---
  {
    ...selectBase,
    "name": "GlobalDirect",
    "type": "select",
    "proxies": ["DIRECT", "Proxy"],
    "include-all": true,
    "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/link.svg"
  },
  {
    ...selectBase,
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

const domain_yaml = {
  "type": "http",
  "behavior": "domain",
  "format": "yaml",
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
  // 广告拦截（JS 独有）
  "category-ads_domain": {
    ...domain_mrs,
    "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-ads@ads.mrs",
    "path": "./ruleset/meta-rules-dat/geosite/category-ads@ads.mrs"
  },
  "telegram_ip": {
    ...ip_mrs,
    "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/telegram.mrs",
    "path": "./ruleset/meta-rules-dat/geoip/telegram.mrs"
  },
  // Google
  "google_domain": {
    ...domain_mrs,
    "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google.mrs",
    "path": "./ruleset/meta-rules-dat/geosite/google.mrs"
  },
  // Microsoft CN
  "microsoft@cn_domain": {
    ...domain_mrs,
    "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/microsoft@cn.mrs",
    "path": "./ruleset/meta-rules-dat/geosite/microsoft@cn.mrs"
  },
  // 自用过滤
  "filter": {
    ...domain_yaml,
    "url": "https://raw.githubusercontent.com/mochenya/myself_mihomo_rules_bin/refs/heads/main/providers/filter.yaml",
    "path": "./ruleset/mochen/filter.yaml"
  }
};

// 路由规则
const rules = [
  // 本地绕行
  "RULE-SET,private_ip,GlobalDirect,no-resolve",
  "RULE-SET,filter,GlobalDirect",
  "RULE-SET,private_domain,GlobalDirect",
  "RULE-SET,applications,GlobalDirect",

  // 广告拦截
  "RULE-SET,category-ads_domain,GlobalBlock",

  // Google
  "RULE-SET,google_domain,Proxy",

  // Microsoft CN
  "RULE-SET,microsoft@cn_domain,GlobalDirect",

  // 地区分流与兜底
  "RULE-SET,cn_domain,GlobalDirect",
  "RULE-SET,tld-cn_domain,GlobalDirect",
  "RULE-SET,geolocation-!cn_domain,Proxy",

  // 最终 IP 规则
  "RULE-SET,telegram_ip,Proxy,no-resolve",
  "RULE-SET,cn_ip,GlobalDirect,no-resolve",
  "MATCH,Proxy"
];
