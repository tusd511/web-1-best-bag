# Web 1 Best Bag

- do an web 1 k24
- ### Simple workflow for deploying static content to GitHub Pages
  - name: Deploy static content to Pages
    - https://bhbghghbgb.github.io/web-1-best-bag/

## test data summary

<details>

<summary>hien noi dung da dc an di</summary>

- thoi gian luu iso string timezone +07:00
- 750 san pham
- 100 nguoi dung
  - 2 chu cuoi ten viet lien khong dau dung cho
    - sau dau cham email
    - truoc dau tru password
    - username `[viet xuoi].[viet nguoc][4 so ngau nhien]`
  - ngay tao trong nam 2024, truoc 25/11/2024
  - bi khoa tai khoan: ty le 5%
- 200 hoa don
  - chi chon trong 100 san pham
  - chi chon trong 80 nguoi dung
  - ngay tao trong nam 2024, truoc 25/11/2024
  - toi da 5 chi tiet moi hoa don
    - toi da 5 so luong san pham moi chi tiet
  - trang thai xu ly: `["dang", "chua", "huy", "roi"]`, `cum_weights=[10, 25, 60, 1000]`

</details>

## Nội dung hướng dẫn hiểu code

### Sự kiện tải dữ liệu, hành động SAU khi đã tải

<details>

<summary>hien noi dung da dc an di</summary>

- Cac ham chi la viet mau/vi du, co the thay doi

1. Cơ bản hàm tải tổng là làm gì
2. ![image](https://github.com/user-attachments/assets/7d7f3ef5-2fc4-4c0e-953b-a0632a1c2a1b)
3. ví dụ hàm thong ke thoi gian **CẦN CÓ** hóa đơn đã tải xong
4. ![image](https://github.com/user-attachments/assets/5b60a5c5-c1fb-457a-97e4-c824c47931f6)
5. hiện biểu đồ cần kết quả thống kê
6. ![image](https://github.com/user-attachments/assets/ef048f9a-6788-4821-bc60-a9ff2738a7b4)
7. gọi theo thứ tự
8. ![image](https://github.com/user-attachments/assets/35d7c435-0b64-42ab-8f54-8142b8358f57)
9. bởi vì hàm tải nhận vào hàm các hành động thực hiện **SAU KHI TẢI**
10. ![image](https://github.com/user-attachments/assets/66faea25-0d8c-419e-98f0-5d900818f8b7)

</details>

### Flow hiển thị

<details>

<summary>hien noi dung da dc an di</summary>

- Cac ham chi la viet mau/vi du, co the thay doi

1. Sự kiện load gọi hàm tải dữ liệu
   1. ![image](https://github.com/user-attachments/assets/53c1bd7c-afd2-41c1-a78c-cde115824985)
2. hàm tải gọi hàm kiểm tra localstorage
   1. file và key
   2. ![image](https://github.com/user-attachments/assets/73a439a2-e120-41a2-a88e-28886266d5e8)
   3. kiểm tra nếu có localstorage rồi thì trả về ko thì tải ban đầu từ file
   4. ![image](https://github.com/user-attachments/assets/49aec496-0a95-4dd4-9c69-6dfea52e32d8)
   5. ![image](https://github.com/user-attachments/assets/c58e49db-0a3b-40ab-9bc8-6dff21ff78f2)
   6. gọi hàm tính dữ liệu hiển thị
3. hàm tính dữ liệu được hiển thị
   1. trong hàm hiển thị, tính toán danh sách hiển thị
   2. ![image](https://github.com/user-attachments/assets/14a62340-2053-4469-9c12-89e69bbcfad5)
      1. gọi hàm lấy param để lấy các cài đặt hiển thị
      2. ![image](https://github.com/user-attachments/assets/2b434e6a-c105-49fe-a639-78ea5412f13e)
   3. sử dụng cài đặt để lọc, sắp xếp hoặc tìm kiếm
   4. ![image](https://github.com/user-attachments/assets/5ca7e4b2-9879-4c8f-b43f-4b771bdb1686)
   5. tính các chỉ số phân trang và chia mảng trang hiện tại
   6. ![image](https://github.com/user-attachments/assets/68547ce3-1358-4aa3-af53-49027ebdfd09)
   7. gọi hàm hiển thị
4. hàm hiển thị sử dụng mảng đã chia phân trang
   1. để hiện danh sách và pagination
   2. ![image](https://github.com/user-attachments/assets/89e8f9c5-6e95-44ef-a49f-713de4149a95)
   3. hàm hiển thị danh sách sp tìm phân tử thế chỗ rồi thêm các item vào
      1. ![image](https://github.com/user-attachments/assets/8f2e841d-e9f8-4e12-a2bb-e3210c2731c5)
      2. hàm render Item một sản phẩm
      3. ![image](https://github.com/user-attachments/assets/334dda3b-244c-4352-ad14-a5fb7e8be685)
   4. hàm hiển thị pagination chỉ sử dụng chỉ số hiện tại và tối đa để tạo hiển thị
      1. ![image](https://github.com/user-attachments/assets/1003825d-fc30-4d3f-b192-5e04f3400e2d)
5. thực hiện tương tự cho sản phẩm, người dùng, hóa đơn

</details>

### Xử lý tab trong trang admin

<details>

<summary>Hướng Dẫn Tạo Tabs Cho Giao Diện HTML CSS JS Thuần</summary>

#### Hướng Dẫn Tạo Tabs Cho Giao Diện HTML CSS JS Thuần

##### Bước 1: Tạo Nhiều File HTML Cho Mỗi Tab

- Mỗi tab sẽ tương ứng với một file HTML riêng, ví dụ: `thongke.html`, `nguoidung.html`, v.v.

##### Bước 2: Test Và Comment HTML Không Cần Thiết

- Sau khi kiểm tra nội dung của từng file HTML và đảm bảo rằng nó hiển thị đúng, comment phần HTML không cần thiết, chỉ giữ lại nội dung trong `<body>`.

##### Bước 3: Load Nội Dung Các Tab Bằng Fetch

- Sử dụng `fetch` để load nội dung của các file HTML vào một wrapper.

##### Ví dụ:

1. **Tạo file `nguoidung.html` với nội dung mẫu:**

   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <link rel="stylesheet" href="/style.css" />
       <link rel="stylesheet" href="./admin.css" />
       <link
         rel="shortcut icon"
         href="images/icons8-bag-96.png"
         type="image/png"
       />
       <script src="/main.js"></script>
       <script src="./admin.js"></script>
       <title>Web 1 Best Bag</title>
     </head>
     <body>
       <h1>Danh Sách Người Dùng</h1>
       <div class="user-list"></div>
       <div class="pagination"></div>
     </body>
   </html>
   ```

   - Thuc hien test va kiem tra co hien chinh xac chua

2. **Sửa file `nguoidung.html`:**

   - Xóa các phần không liên quan, giữ lại nội dung chính:
     ```html
     <!-- Comment phần không cần thiết -->
     <!-- ... -->
     <h1>Danh Sách Người Dùng</h1>
     <div class="product-list"></div>
     <div class="pagination"></div>
     <!-- ... -->
     ```

3. **Sửa `admin.html`:**

   - Tạo một wrapper để hiển thị nội dung của các tab:
     ```html
     <div id="content-wrapper"></div>
     ```

4. **Sửa `admin.js`:**

   - Kiểm tra tab đang được chọn và dùng `fetch` để load file HTML tương ứng:

     ```javascript
     const loadTabContent = async (tab) => {
       const response = await fetch(`${tab}.html`);
       const data = await response.text();
       document.getElementById("content-wrapper").innerHTML = data;
     };

     // Ví dụ khi chọn tab "nguoidung"
     loadTabContent("nguoidung");
     ```

     Hoac

     ```javascript
     const wrapper = document.getElementById("content-wrapper"); // Giả sử wrapper có id là 'content-wrapper'

     function loadTabContent(tabName) {
       fetch(`${tabName}.html`)
         .then((response) => response.text())
         .then((data) => {
           wrapper.innerHTML = data;
         });
     }
     ```

##### Kết Quả

- **Ưu điểm:** Các tab như `thongke` hay `nguoidung` sẽ được load từ file HTML riêng, giúp quản lý nội dung dễ dàng và tránh việc phải ẩn hiện nhiều phần tử HTML phức tạp.

##### Ghi Chú

- Nhớ comment lại phần HTML không cần thiết, thay vì xóa, để có thể dễ dàng kiểm tra lại khi cần.

</details>

## Nội dung k liên quan code

### ghi thêm cách tạo nhánh cho mấy bạn bảo chịu thua

<details>

<summary>hien noi dung da dc an di</summary>

1. ![image](https://github.com/user-attachments/assets/ca9cc847-18b2-49e8-884a-37d46ea62a8e)
2. ![image](https://github.com/user-attachments/assets/f08eb559-26a4-47f4-b9e2-e59db3e1512a)
3. ![image](https://github.com/user-attachments/assets/73894cc7-a6ad-44b4-8ccc-252b20400e6f)
4. ![image](https://github.com/user-attachments/assets/2c2f3a4d-aef8-4fd2-ab0c-c96ebef03e42)
5. ![image](https://github.com/user-attachments/assets/f826ca95-8260-4a81-9eef-ff53411ef428)
6. ![image](https://github.com/user-attachments/assets/17a40ffc-bb72-4668-a8af-5d2d30ba2112)
7. ![image](https://github.com/user-attachments/assets/6fc56db2-4d35-4ff2-ad06-6eba12a357e8)

</details>
