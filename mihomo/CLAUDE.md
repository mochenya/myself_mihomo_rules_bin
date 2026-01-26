# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Mihomo 官方文档资源指南

本文件夹包含从 Mihomo (Clash.Meta) 官方仓库下载的文档资源和配置示例，供配置修改时参考查阅。

## 目录结构

```
mihomo/
├── docs/                           # 官方文档
│   ├── config/                     # 【核心】配置模块参考文档（75个文档）
│   │   ├── general.md              # 全局配置（端口、认证、日志、IPv6等）
│   │   ├── dns/                    # DNS 配置（总览、流程图、hosts、类型）
│   │   ├── inbound/                # 流量入站配置
│   │   │   ├── listeners/          # 入站监听器（20个协议文档）
│   │   │   └── tun.md              # TUN 虚拟网卡
│   │   ├── proxies/                # 代理节点配置（23个协议）
│   │   ├── proxy-groups/           # 策略组配置（7种类型）
│   │   ├── proxy-providers/        # 代理集合配置
│   │   ├── rule-providers/         # 规则集合配置
│   │   ├── rules/index.md          # 路由规则配置（50+种规则）
│   │   └── sniff/                  # 流量嗅探配置
│   ├── handbook/                   # 使用手册（工作原理和最佳实践）
│   ├── example/                    # 配置示例（各种格式）
│   └── api/                        # RESTful API 文档
│
└── example_config.yaml             # 【重要】官方完整配置示例（1776行）
```

## 配置模块快速索引

| 配置需求 | 文档路径 |
|---------|---------|
| 全局配置（端口、模式、日志） | `docs/config/general.md` |
| DNS 配置（分流、fake-ip） | `docs/config/dns/index.md` |
| TUN 虚拟网卡 | `docs/config/inbound/tun.md` |
| 代理节点（ss/vmess/trojan等） | `docs/config/proxies/index.md` |
| 策略组（选择/测速/负载均衡） | `docs/config/proxy-groups/index.md` |
| 代理集合（自动更新节点） | `docs/config/proxy-providers/index.md` |
| 规则集合（rule-set引用） | `docs/config/rule-providers/index.md` |
| 路由规则（所有规则类型） | `docs/config/rules/index.md` |
| 流量嗅探（TLS/QUIC嗅探） | `docs/config/sniff/index.md` |
| 完整配置示例 | `example_config.yaml` |

## 文档查阅流程

### 1. 修改已有配置
1. 先查看 `example_config.yaml` 找到相关配置段
2. 再查阅 `docs/config/` 对应模块的详细文档

### 2. 添加新功能
1. 查阅 `docs/config/` 对应模块文档
2. 参考 `example_config.yaml` 中的示例
3. 查看 `docs/example/` 中的具体格式示例

### 3. 理解工作原理
1. 阅读 `docs/handbook/` 中的原理文档
2. 包括 DNS、路由、出站的工作机制

## example_config.yaml 结构概览

```yaml
# 1-246行：全局配置
#   - mixed-port, allow-lan, mode, log-level
#   - external-controller, tls, profile, tun, sniffer

# 246-362行：DNS 配置
#   - enhanced-mode, nameserver, fallback, nameserver-policy

# 362-1105行：代理节点
#   - 23种协议示例：ss, ssr, vmess, vless, trojan, hysteria2, tuic, wg, ssh 等

# 1105-1171行：策略组
#   - select, url-test, fallback, load-balance, relay

# 1171-1229行：代理集合
#   - HTTP/File 类型，健康检查和过滤规则

# 1229-1269行：规则集合
#   - HTTP/File/Inline 类型

# 1269-1776行：路由规则
#   - DOMAIN, DOMAIN-SUFFIX, DOMAIN-KEYWORD
#   - IP-CIDR, GEOIP, GEOSITE
#   - RULE-SET 引用
```

## 常用配置段速查

### 代理协议支持（23种）
- Shadowsocks (ss), ShadowsocksR (ssr)
- VMess, VLESS, Trojan
- Hysteria, Hysteria2, TUIC
- WireGuard (wg), SSH
- SOCKS, HTTP, Direct, DNS

### 策略组类型（7种）
1. **select** - 手动选择
2. **url-test** - URL 测试（自动选择最快）
3. **fallback** - 故障转移
4. **load-balance** - 负载均衡
5. **relay** - 中继链
6. **direct** - 直连（内置）
7. **reject** - 拒绝（内置）

### 路由规则类型（50+种）
- 域名类：DOMAIN, DOMAIN-SUFFIX, DOMAIN-KEYWORD
- IP类：IP-CIDR, IP-CIDR6, GEOIP
- 端口类：SRC-PORT, DST-PORT
- 进程类：PROCESS-NAME
- 规则集：RULE-SET

## 文档特色

1. **模块化设计**：每个配置模块独立文档，便于查阅
2. **详细注释**：所有配置字段都有中文说明
3. **完整示例**：提供实际可用的配置代码
4. **原理说明**：handbook 文档解释工作原理

## 注意事项

- 本文件夹内容来自官方仓库，**仅作参考，不要修改**
- 配置修改请在项目根目录的 YAML 文件中进行
- YAML 语法要求严格，注意缩进和冒号后的空格
