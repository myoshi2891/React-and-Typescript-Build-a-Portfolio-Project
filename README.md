# 概要

## 関連ソースファイル
* **jbook/.gitignore**
* **jbook/package.json**
* **jbook/packages/cli/src/commands/serve.ts**
* **jbook/packages/local-api/src/index.ts**
* **jbook/packages/local-client/src/components/resizable.tsx**

## 目的とスコープ

この文書は、jsnote-cli-jp2024リポジトリの概要を提供します。これは、インタラクティブなJavaScript開発のためのノートブックスタイルのアプリケーションです。このシステムでは、ユーザーがJavaScriptコードまたはマークダウンテキストを含む「セル」を作成・編集できます。Jupyterノートブックに似ていますが、ブラウザでのJavaScript実行に特化して設計されています。

CLIコマンドとオーケストレーションの詳細については、**CLIパッケージ**を参照してください。サーバーサイドのAPI機能については、**ローカルAPIパッケージ**を参照してください。Reactベースのユーザーインターフェースについては、**ローカルクライアントパッケージ**を参照してください。

## アプリケーション機能

jsnote-cli-jp2024アプリケーションにより、開発者は以下のことができます：

* 実行可能なコードセルとテキストセルを含むインタラクティブなJavaScriptノートブックの作成
* 構文ハイライトとIntelliSenseを備えたMonacoエディターを使用したコード編集
* リアルタイムバンドリングのために`esbuild-wasm`を使用したブラウザでの直接的なJavaScriptコード実行
* バージョン管理と共有のためのローカル`.js`ファイルへのノートブックデータの永続化
* ノートブックインターフェース内でのセルのリサイズと並び替え
* 開発モード（ホットリロード付き）と本番モード（静的ファイル）の両方での実行

このシステムは完全にローカルで動作し、コア機能に対して外部サービスやインターネット接続は必要ありません。

## システムアーキテクチャ

以下の図は、モノレポ構造内の主要パッケージとその関係を示しています：

### パッケージの依存関係と通信フロー

```mermaid
graph TD
    A[jsnote-cli-jp2024<br/>ルートパッケージ] --> B[CLI Package<br/>@jsnote-cli-jp2024/cli]
    A --> C[Local API Package<br/>@jsnote-cli-jp2024/local-api]
    A --> D[Local Client Package<br/>@jsnote-cli-jp2024/local-client]
    
    B --> |依存| C
    B --> |静的ファイル配信| D
    C --> |API通信| D
    
    B --> E[Commander.js<br/>CLIフレームワーク]
    C --> F[Express.js<br/>HTTPサーバー]
    C --> G[http-proxy-middleware<br/>開発用プロキシ]
    D --> H[React + TypeScript<br/>フロントエンド]
    D --> I[Monaco Editor<br/>コードエディター]
    D --> J[esbuild-wasm<br/>バンドラー]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
```

**出典：** jbook/packages/cli/src/commands/serve.ts22-27, jbook/packages/local-api/src/index.ts6-13, jbook/package.json1-10

## ランタイムアーキテクチャとデータフロー

以下の図は、アプリケーション実行中のコンポーネント間の相互作用を示しています：

### コンポーネント相互作用フロー

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant CLI as CLI Package
    participant API as Local API Server
    participant Client as React Client
    participant Monaco as Monaco Editor
    participant ESBuild as esbuild-wasm
    participant FileSystem as ローカルファイル
    
    User->>CLI: jsnote serve [filename]
    CLI->>API: サーバー起動 (Express.js)
    
    alt 開発モード (useProxy: true)
        API->>Client: localhost:3000 にプロキシ
    else 本番モード (useProxy: false)
        API->>Client: 静的ファイル配信
    end
    
    User->>Client: ブラウザでアクセス
    Client->>API: セルデータ取得 (GET /cells)
    API->>FileSystem: .jsファイル読み込み
    FileSystem-->>API: セルデータ
    API-->>Client: JSON形式でセルデータ
    
    User->>Monaco: コード編集
    Monaco->>Client: コード変更通知
    Client->>ESBuild: コードバンドリング
    ESBuild-->>Client: バンドル済みコード
    Client->>Client: セル実行・表示更新
    
    Client->>API: セル保存 (POST /cells)
    API->>FileSystem: .jsファイル更新
    
    Note over User, FileSystem: リアルタイム編集・実行サイクル
```

**出典：** jbook/packages/cli/src/commands/serve.ts15-27, jbook/packages/local-api/src/index.ts12-28, jbook/packages/local-client/src/components/resizable.tsx8-57

## 主要技術と機能

| コンポーネント | 技術 | 目的 |
|-------------|------|------|
| パッケージ管理 | Lerna | 共有依存関係を持つモノレポ構造 |
| CLIフレームワーク | Commander.js | `serve`コマンドのコマンドラインインターフェース |
| サーバーフレームワーク | Express.js | APIエンドポイントと静的ファイルのHTTPサーバー |
| プロキシミドルウェア | http-proxy-middleware | localhost:3000への開発モードプロキシ |
| フロントエンドフレームワーク | React + TypeScript | ユーザーインターフェースコンポーネントと状態管理 |
| 状態管理 | Redux | セルとUIのアプリケーション状態 |
| コードエディター | Monaco Editor | 構文ハイライトとIntelliSense |
| コード実行 | esbuild-wasm | クライアントサイドJavaScriptバンドリングと実行 |
| UIレイアウト | react-resizable | リサイズ可能なパネルとコンポーネント |
| HTTPクライアント | Axios | クライアントとサーバー間のAPI通信 |

**出典：** jbook/package.json4-5, jbook/packages/cli/src/commands/serve.ts2, jbook/packages/local-api/src/index.ts1-4

## デュアルモード動作

アプリケーションは`useProxy`パラメータによって決定される2つの動作モードをサポートします：

### 開発モード（`useProxy: true`）

* ホットリロード機能のために`http://localhost:3000`へのリクエストをプロキシ
* Create React App開発サーバーでのライブ開発を有効化
* `NODE_ENV !== "production"`の場合に有効化

### 本番モード（`useProxy: false`）

* `@jsnote-cli-jp2024/local-client/build/`からの事前ビルド済み静的ファイルを提供
* デプロイメントと配布のために最適化
* `NODE_ENV === "production"`の場合のデフォルトモード

```mermaid
flowchart LR
    Start([アプリケーション起動]) --> Check{NODE_ENV === 'production'?}
    
    Check -->|Yes| Production[本番モード<br/>useProxy: false]
    Check -->|No| Development[開発モード<br/>useProxy: true]
    
    Production --> StaticFiles[静的ファイル配信<br/>local-client/build/]
    Development --> Proxy[プロキシ<br/>localhost:3000]
    
    StaticFiles --> End([ユーザーアクセス])
    Proxy --> ReactDev[React開発サーバー<br/>ホットリロード対応]
    ReactDev --> End
    
    style Production fill:#ffcdd2
    style Development fill:#c8e6c9
    style End fill:#e1f5fe
```

**出典：** jbook/packages/cli/src/commands/serve.ts5-26, jbook/packages/local-api/src/index.ts15-28
