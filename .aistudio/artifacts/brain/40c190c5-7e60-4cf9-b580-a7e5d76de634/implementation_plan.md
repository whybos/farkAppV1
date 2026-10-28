# YTÜ FARK — Tasarım Sistemi Birleştirme, Tema Desteği, Akıllı Görsel Yükleyici ve "FARK'ında" Bileşeni Planı

Bu çalışma; YTÜ Fikri Araştırmalar Kulübü (FARK) web uygulamasındaki dağınık stil dosyalarını merkezi ve sürdürülebilir bir tasarım sisteminde toplamayı, Gece/Aydınlık mod geçişi kazandırmayı, Admin Panelini modernleştirerek sürükle-bırak otomatik sıkıştırmalı Base64 görsel yükleyici eklemeyi, çoklu menü elemanlarında bozulmayan esnek Navbar/Footer yapısını kurmayı ve Google Drive yönlendirmeli **"FARK'ında"** bileşenini hem kullanıcı arayüzüne hem de yönetim paneline entegre etmeyi kapsar.

---

## Kullanıcı İncelemesi ve Kritik Kararlar

> [!IMPORTANT]
> **Güncellenen ve Onaylanan Mimari Kararlar**
> Geri bildiriminiz doğrultusunda **FARK'ında** bileşeni ve sunucu iletişimi aşağıdaki şekilde güncellenmiştir:

- **Karar 1 — "FARK'ında" Bileşeni (`farkinda`) Sunucu Erişimi ve Drive Yönlendirmesi**:
  - Sunucuya PDF yükleyip sunucuyu yormak yerine, PDF dosyaları Google Drive'da tutulacak ve backend sadece **Link (`link`)**, **Başlık (`title`)**, **Tarih (`date`)** (ve kart görseli için **Fotoğraf (`photo`)**) verilerini saklayacaktır.
  - Frontend tarafındaki `FarkindaService`, tıpkı diğer servisler gibi doğrudan sunucuya (`https://api.ytufarkk.com/api/Farkinda` — `GET`, `POST`, `PATCH`, `DELETE`) istek atacaktır.
  - Ziyaretçi `farkinda` sayfasında ilgili yayının fotoğrafına/kartına tıkladığında doğrudan kaydedilen **Google Drive linkine** yönlendirilecektir.
- **Karar 2 — Otomatik Sıkıştırmalı Sürükle-Bırak Base64 Yükleyici**: Admin panelindeki tüm fotoğraf alanları (`Haberler`, `Haber Detayları`, `Slider`, `Blog/Konuşmacı` ve `FARK'ında`), fotoğrafı sürükleyip bıraktığınızda tarayıcı içinde otomatik olarak boyutlandırıp sıkıştırarak Base64 metnine çevirecek ve forma otomatik yazacaktır.
- **Karar 3 — Merkezi CSS, Admin Paneli Yenilemesi, Esnek Navbar/Footer ve Gece/Aydınlık Mod**:
  - Tüm bileşenlerdeki tekrar eden CSS'ler `styles.css` altında birleştirilecek.
  - Varsayılan olarak **Koyu Mod** açılacak, Navbar'dan **Aydınlık Mod**a geçiş yapılabilecek ve seçim tarayıcıda (`localStorage`) hatırlanacak.
  - Admin paneli, sitenin genel koyu/aydınlık kurumsal stiline kavuşturulacak; Footer ve Navbar çok sayıda eleman eklendiğinde kaymayacak ve yamulmayacak şekilde esnek ızgara (grid/flex-wrap) yapısına geçirilecek.

---

## 1. Genel Bakış ve Temel Kavram

- **Ne Yapar?**: Kulüp ziyaretçilerine haber, blog, etkinlik, soru-cevap ve geçmiş PDF yayınlarını ("FARK'ında") hem gece hem aydınlık modda kusursuz bir görsel hiyerarşiyle sunar; kulüp yöneticilerine ise tek tip, şık ve sürükle-bırak kolaylığına sahip bir içerik yönetim deneyimi sağlar.
- **Hedef Kitle**: YTÜ FARK üyeleri, öğrenciler ve içerik yönetimi yapan kulüp yöneticileri.
- **Temel Değer**:
  - Yüzlerce satırlık tekrar eden CSS kodlarının tek bir merkezi tema mimarisinde toplanması.
  - PDF'lerin Google Drive linki üzerinden açılması ve görsellerin sıkıştırılmış Base64'e çevrilmesi sayesinde sunucuya minimum yük binmesi.
  - Çok sayıda link eklendiğinde dahi bozulmayan Navbar ve Footer düzeni.

---

## 2. Kullanıcı Deneyimi ve Görsel Tasarım

### Görsel Kimlik ve Tema (Gece & Aydınlık Mod)
- **Estetik Yönelim**: Kurumsal kulüp kimliğini yansıtan, altın-kum (`#e0cf95` / aydınlık modda yüksek kontrastlı sıcak bronz `#9a7b2c`) vurgulara sahip modern tasarım dili.
- **Renk Paleti ve CSS Değişkenleri**:
  - **Gece Modu (Varsayılan)**:
    - Ana Arka Plan (`--bg-primary`): `#141414`
    - Yüzey / Kart Arka Planı (`--bg-surface`): `#1f1f1f` – `#242424`
    - Birincil Metin (`--text-primary`): `#f0f0f0`
    - İkincil Metin (`--text-muted`): `#a6a6a6`
    - Vurgu Rengi (`--accent-primary`): `#e0cf95`
  - **Aydınlık Mod**:
    - Ana Arka Plan (`--bg-primary`): `#f8f6f0`
    - Yüzey / Kart Arka Planı (`--bg-surface`): `#ffffff`
    - Birincil Metin (`--text-primary`): `#1c1917`
    - İkincil Metin (`--text-muted`): `#57534e`
    - Vurgu Rengi (`--accent-primary`): `#b5943b`

### Temel Kullanıcı Akışları
1. **"FARK'ında" Ziyaretçi ve Admin Akışı (`/farkinda` & `/adminPanel/farkinda`)**:
   - **Admin Paneli (`admin-farkinda`)**: Yöneticiler "Yeni Ekle" veya "Güncelle" modalı üzerinden **Başlık (`title`)**, **Tarih (`date`)**, **Google Drive Linki (`link`)** ve sürükle-bırak **Fotoğraf (`photo`)** alanlarını düzenleyip kaydeder. Veriler doğrudan sunucu API'sine gönderilir.
   - **Ziyaretçi Sayfası (`farkinda`)**: Sunucudan gelen yayınlar sitenin kart tasarımıyla listelenir. Kullanıcı karta/fotoğrafa tıkladığında doğrudan ilgili **Google Drive linkine** yönlendirilir.
2. **Sürükle-Bırak Görsel Yükleyici**:
   - Admin panelindeki fotoğraf alanlarına görsel sürüklenip bırakıldığında (veya tıklanıp seçildiğinde) tarayıcı görseli otomatik olarak boyutlandırıp sıkıştırır, canlı önizlemesini gösterir ve Base64 kodunu form alanına otomatik doldurur.
3. **Esnek Navbar ve Footer**:
   - Footer'a çok sayıda link eklendiğinde aşağı kayıp yamulmasını önlemek için çok sütunlu esnek Grid/Flex yapısı kullanılır.
   - Navbar'da çoklu menü elemanlarının taşmasını engelleyen esnek yapı ve Gece/Aydınlık mod değiştirici buton yer alır.

---

## 3. Temel Ürün Kararları ve Ödünleşimler (Trade-Offs)

- **Karar 1: "FARK'ında" İçin Google Drive Link Yönlendirmesi**
  - *Seçilen Yaklaşım*: Backend'de PDF dosyası tutmak yerine `title`, `date`, `link` (ve `photo`) alanlarını tutmak; tıklama anında kullanıcıyı doğrudan Drive linkine yönlendirmek.
  - *Neden?*: Sunucu kapasitesi sınırlı olduğundan PDF trafiğini tamamen Google Drive üzerine yıkar, sunucu yalnızca küçük JSON verisini taşır.
- **Karar 2: İstemci Taraflı (Client-Side) Otomatik Görsel Sıkıştırma**
  - *Seçilen Yaklaşım*: Sürükle-bırak yapılan fotoğrafları tarayıcıda `<canvas>` ile optimize edip Base64'e dönüştürmek.
  - *Neden?*: Mevcut backend Base64 metni beklediği için mimariyi bozmadan fotoğrafların veritabanında ve ağ trafiğinde kapladığı alanı %80 oranında küçültür.

---

## 4. Teknik Mimari ve Veri Stratejisi

### Sistem ve Bileşen Mimarisi Diyagramı

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        YTÜ FARK UYGULAMA ÇATISI (App)                      │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Merkezi Tema & Stil Katmanı (ThemeService + styles.css Değişkenleri) │  │
│  │ Varsayılan: Koyu Mod ('dark') <───> Aydınlık Mod ('light') [Kalıcı]  │  │
│  └───────────────┬──────────────────────────────────────┬───────────────┘  │
│                  ▼                                      ▼                  │
│  ┌───────────────────────────────────┐  ┌───────────────────────────────┐  │
│  │ ZİYARETÇİ ARAYÜZÜ & NAVİGASYON    │  │ YÖNETİM PANELİ (AdminPanel)   │  │
│  │ • Esnek Navbar (+Tema Anahtarı)   │  │ • Kurumsal Admin Sekmeleri    │  │
│  │ • Ana Sayfa, Haberler, Blog       │  │ • Sürükle-Bırak Base64 Yükle  │  │
│  │ • Hakkımızda, İletişim, Sorgu     │  │   (Otomatik Sıkıştırmalı)     │  │
│  │ • YENİ: FARK'ında (/farkinda)     │  │ • YENİ: Admin FARK'ında       │  │
│  │   (Tıklayınca Drive'a Yönlendirir)│  │   (Başlık, Tarih, Link, Foto) │  │
│  │ • Bozulmayan Esnek Footer         │  │ • Tema Uyumlu Kart & Modallar │  │
│  └───────────────┬───────────────────┘  └───────────────┬───────────────┘  │
│                  │                                      │                  │
│                  └──────────────────┬───────────────────┘                  │
│                                     ▼                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ SERVİS KATMANI (https://api.ytufarkk.com/api/*)                      │  │
│  │ • FarkindaService : GET / POST / PATCH / DELETE -> /api/Farkinda     │  │
│  │ • Mevcut Servisler: Navbar, Slider, News, NewsDetail, Blog, Footer   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

### Veri Modeli ve Servis Yapısı
- **FARK'ında Modeli (`farkindaModel`)**:
  - `id: number`
  - `title: string` (Başlık)
  - `date: string` (Tarih)
  - `link: string` (Google Drive Linki)
  - `photo?: string` (Sürükle-bırak ile Base64'e çevrilen kapak fotoğrafı)
- **FARK'ında Servisi (`FarkindaService`)**:
  - `apiUrl = 'https://api.ytufarkk.com/api/Farkinda'`
  - `getFarkinda()`, `createFarkinda(data)`, `updateFarkinda(data)`, `deleteFarkinda(id)` metotlarıyla diğer tüm servislerle (`NewsService`, `BlogService` vb.) birebir aynı yapıda çalışır.
