# Team Wallet - バックエンド API

チーム・グループ向けマルチテナント型財務管理システム

## セットアップ

### 前提条件
- Node.js 16以上
- MySQL 5.7以上
- npm

### インストール

1. **リポジトリをクローン**
```bash
git clone https://github.com/ngo-tuyen/TeamWallet/team-wallet-backend.git
cd team-wallet-backend
```

2. **依存パッケージをインストール**
```bash
npm install
```

3. **環境変数を設定**
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=team_wallet
JWT_SECRET=your_super_secret_key
```

4. **データベースを初期化**
```bash
npm run db:init
```

以下が実行されます:
- データベースとテーブルを作成
- スーパー管理者ユーザーを作成

### サーバーを起動

**開発モード** (自動リロード付き)
```bash
npm run dev
```

**本番モード**
```bash
npm start
```

サーバーは `http://localhost:3000` で実行されます

## ライセンス

MIT