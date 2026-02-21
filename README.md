<p align="center">
  <img src="./public/favicon_black.svg" alt="8004" width="160" />
</p>

<h2 align="center">8004</h2>

<p align="center">
  Semantic search for on-chain AI agents.<br/>
  Payment-gated discovery powered by the x402 protocol.
</p>

<p align="center">
  <a href="https://opensource.org/licenses/BSD-3-Clause"><img src="https://img.shields.io/badge/License-BSD%203--Clause-blue.svg" alt="License"></a>
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Monad-USDC-836EF9" alt="Monad">
  <img src="https://img.shields.io/badge/Protocol-x402-orange" alt="x402">
  <img src="https://img.shields.io/badge/Standard-ERC--8004-black" alt="ERC-8004">
</p>

<p align="center">
  <a href="https://8004.qntx.fun">Live Demo</a>&ensp;·&ensp;
  <a href="https://docs.qntx.fun">Documentation</a>&ensp;·&ensp;
  <a href="https://github.com/qntx/erc8004">ERC-8004 Spec</a>
</p>

---

## Overview

**8004** is a fully client-side semantic search interface for discovering AI agents registered under the [ERC-8004](https://github.com/qntx/erc8004) standard. Every search query is payment-gated via the [x402](https://www.x402.org/) protocol — connect a wallet, sign a USDC micropayment, and get results. No API keys. No backend accounts. No subscriptions.

**Agents pay to discover agents. Humans pay to discover agents. The protocol doesn't care.**

## Architecture

```mermaid
graph TD
    A[Client: React SPA] --> B[Wallet: RainbowKit + wagmi]
    B --> C[x402 Fetch: Sign USDC payment]
    C --> D[Search API: HTTP 402 gateway]
    D --> E[Results: Ranked agent cards]

    style A fill:#f9f9f9,stroke:#333,stroke-width:2px
    style B fill:#f9f9f9,stroke:#333,stroke-width:2px
    style C fill:#f9f9f9,stroke:#333,stroke-width:2px
    style D fill:#f9f9f9,stroke:#333,stroke-width:2px
    style E fill:#f9f9f9,stroke:#333,stroke-width:2px
```

Every search follows the same stateless cycle: **query → HTTP 402 → sign payment → retry with signature → ranked results**. The client holds no session state; the gateway holds no user credentials.

## Features

- **Semantic search** — Natural language queries against all ERC-8004 registered AI agents across multiple EVM chains
- **Payment-gated access** — Per-query USDC micropayments via x402, settled on Monad
- **Multi-chain discovery** — Agents from Ethereum, Base, Arbitrum, Optimism, Polygon, Avalanche, BNB Chain, and more
- **Rich agent cards** — Name, description, relevance score, chain badge, service tags, x402 support, trust indicators
- **Cursor pagination** — Infinite scroll through large result sets without re-signing
- **Dark / light theme** — System-aware with manual override, persisted to localStorage
- **Fully client-side** — Static SPA deployed to GitHub Pages, zero backend infrastructure

## Infrastructure

Part of QNTX's open-source ecosystem for autonomous AI agents:

- **[`erc8004`](https://github.com/qntx/erc8004)** — Trustless agent identity standard (ERC-8004)
- **[`facilitator`](https://github.com/qntx/facilitator)** — Settlement server for on-chain payment verification
- **[`r402`](https://github.com/qntx/r402)** — Rust implementation of the x402 protocol
- **[`chat`](https://github.com/qntx/chat)** — AI chat interface with per-message micropayments

## Deployment

Automatically deployed to GitHub Pages on every push to `main` via the [qntx/workflows](https://github.com/qntx/workflows) reusable workflow.

## License

This project is licensed under the BSD 3-Clause License — see the [LICENSE](LICENSE) file for details.
