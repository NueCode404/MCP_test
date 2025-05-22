# Render 環境變數設定指南

在 Render 平台上部署您的應用程式時，請設定以下環境變數：

## 必需的環境變數

- `NODE_ENV`: 設置為 `production`
- `DB_HOST`: TiDB 的主機地址
- `DB_USER`: TiDB 的使用者名稱
- `DB_PASSWORD`: TiDB 的密碼
- `DB_NAME`: TiDB 的資料庫名稱
- `DB_CA_CERT`: TiDB 的 CA 憑證內容（整個文件內容，包括 BEGIN CERTIFICATE 和 END CERTIFICATE）

## 其他建議的環境變數

- `PORT`: 應用程式運行的連接埠（通常 Render 會自動設定）
- `JWT_SECRET`: JWT 令牌加密密鑰

## 設定步驟

1. 在 Render 儀表板中，選擇您的 Web 服務
2. 點擊 "Environment" 標籤
3. 新增上述環境變數
4. 對於 `DB_CA_CERT`，您需要複製整個 CA 憑證檔案的內容

## 關於 CA 憑證處理

### 獲取 CA 憑證內容

如果您有 CA 憑證檔案 (如 ca.pem)，您可以使用以下命令讀取其內容:

```bash
cat path/to/ca.pem
```

然後將輸出的內容複製到 Render 環境變數 `DB_CA_CERT` 中，包括 "-----BEGIN CERTIFICATE-----" 和 "-----END CERTIFICATE-----" 這兩行。

### 在 Render 中處理多行文本

Render 環境變數支援多行文本，有兩種方式可以設定：

#### 選項 1：使用 Render 界面的多行輸入

1. 在 Render 界面中，點擊 "Add Environment Variable"
2. 輸入變數名稱 `DB_CA_CERT`
3. 點擊 "Multi-line" 選項
4. 將整個 CA 憑證內容貼上，包括所有換行符
5. 保存環境變數

#### 選項 2：使用 \n 替換換行符

如果您使用 Render 的 API 或遇到界面問題，可以將 CA 憑證中的換行符替換為 `\n` 字符串：

1. 將 CA 憑證檔案中的所有換行符替換為字符串 `\n`
2. 輸入變數值時，以單行形式輸入

例如，將：
```
-----BEGIN CERTIFICATE-----
MIIDETCCAfmgAwIBAgIJAJzxkQ...
...
1j8GeTcNBoF0jIAAAAAAAA==
-----END CERTIFICATE-----
```

轉換為：
```
-----BEGIN CERTIFICATE-----\nMIIDETCCAfmgAwIBAgIJAJzxkQ...\n...\n1j8GeTcNBoF0jIAAAAAAAA==\n-----END CERTIFICATE-----
```

**注意：** 我們的程式碼已經處理了這種格式，會自動將 `\n` 字符串轉換回實際的換行符。

## 測試連接

部署後，您可以查看應用程式的日誌來確認資料庫連接是否成功。如果連接成功，您應該會在日誌中看到以下訊息：

```
CA certificate loaded successfully.
Connecting to database in production mode with SSL. Host: [您的主機], Port: 4000, SSL enabled: true
資料庫連接成功
```

## 錯誤排查

如果您看到以下錯誤：
```
連接錯誤: TiDB 要求使用安全連接 (SSL/TLS)。請確認環境變數中包含正確的 CA 證書。
```

請檢查：
1. `DB_CA_CERT` 環境變數是否正確設定
2. 憑證內容是否包含 "-----BEGIN CERTIFICATE-----" 和 "-----END CERTIFICATE-----"
3. 憑證格式是否正確（換行符或 `\n` 字符串） 