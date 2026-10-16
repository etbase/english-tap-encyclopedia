# 英語點讀百科｜第一冊

兒童英語點讀網站。首頁有 10 個主題，每個主題 12 個單字。點圖片上的編號或右側單字即可聽發音，也可以看例句、切換中英文，以及玩聽音找圖。

朗讀使用瀏覽器內建的語音，不需要另外下載語音檔。用 HTTPS 開啟（例如 GitHub Pages）時，語音比直接點開本機檔案更穩定；第一次播放通常要先在頁面上點一下。

## 線上瀏覽

推上 `main` 並完成 GitHub Pages 部署後，網址是：

https://etbase.github.io/english-tap-encyclopedia/

本機預覽可以在專案根目錄執行：

```bash
python3 -m http.server 8080
```

然後打開 http://127.0.0.1:8080/

## 單元

| 編號 | 主題 | 路徑 |
| --- | --- | --- |
| 01 | 海灘探索 Beach Adventure | `units/beach/` |
| 02 | 客廳探索 Living Room | `units/living/` |
| 03 | 廚房探索 Kitchen | `units/kitchen/` |
| 04 | 教室探索 Classroom | `units/classroom/` |
| 05 | 農場動物 Farm Animals | `units/farm/` |
| 06 | 水果探索 Fruits | `units/fruits/` |
| 07 | 汽車與公車 Cars and Buses | `units/traffic/` |
| 08 | 海底世界 Underwater World | `units/ocean/` |
| 09 | 人體探索 Body Parts | `units/body/` |
| 10 | 生日派對 Birthday Party | `units/birthday/` |

## 目錄

- `index.html`：第一冊首頁
- `units/`：各主題的點讀頁與場景圖
- `assets/`：吉祥物波哥大與首頁縮圖
- `.nojekyll`：讓 GitHub Pages 直接提供這些檔案，不經過 Jekyll

這是純靜態網站，沒有套件、沒有建置步驟。相對路徑已對好，放在使用者網站或專案網站的子路徑都能開啟。
