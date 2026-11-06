# Map Art derleme sistemi

Bu klasör Arachne'yi (GPL-3.0-only) sabit bir commit'ten derleyen sistemi tarif eder.
Ana siteye dokunmaz ve deploy etmez.

- `ARACHNE-COMMIT`: derlenecek Arachne commit'i (40 haneli SHA). Sürüm yükseltmek için burayı değiştir.
- `patches/`: Arachne'ye uygulanan yamalar (yol `/arachne/` -> `/map-art/`, adres `sovalyecraft.space`).
- `NOTICE.md`: telif ve lisans bildirimi, çıktıya `NOTICE.txt` olarak girer.
- Workflow: `.github/workflows/map-art-build.yml`. Actions sekmesinden elle çalıştırılır (Run workflow).

Çıktı: `map-art-<sha>` adlı artifact içinde `map-art.zip`. Zip'in içinde `map-art/` klasörü,
GPL kaynak arşivi (`source/`), lisans ve bildirim dosyaları bulunur.
