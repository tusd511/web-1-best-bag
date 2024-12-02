# Web 1 Best Bag

- do an web 1 k24
- ### Simple workflow for deploying static content to GitHub Pages
  - name: Deploy static content to Pages
    - https://bhbghghbgb.github.io/web-1-best-bag/

## Lưu ý cho các bạn ko đọc tin nhắn zalo của nhóm

- **Update: Mon Dec 02 2024 11:31:53 GMT+0700 (Indochina Time)**: Trên tinh thần mỗi người làm rồi tự cố gắng ghép vào chứ đừng chờ.

- **Update: Fri Nov 29 2024 21:21:43 GMT+0700 (Indochina Time)**

<details open>

<summary>an noi dung da dc hien len</summary>

- nhắc lại, code liên quan đến tải, đọc, lọc, sắp xếp, phân trang, thêm sửa xoá dữ liệu, sản phẩm, người dùng, hoá đơn, giỏ hàng và nhiều loại thống kê đều đã viết trong `main.js/index mẫu/thư mục admin`. Vui lòng link script src file `main.js/admin.js/*.js` vào, KHÔNG copy code ra file riêng vì fix bug sẽ ko update đc

- Về phần hiện sản phẩm trang chủ, code render danh sách nằm trong admin/admin.js do bạn làm trang admin đợi mãi trang chủ chưa làm xong đã tự viết render sản phẩm. SỬ DỤNG LẠI code render sản phẩm trong đó (thay nút chỉnh sửa/xoá thành thêm giỏ hàng, v.v), Code chức năng/giao diện đã có viết rồi mà tự viết lại thì **ko tính đóng góp**

- Hướng dẫn thao tác dùng hàm tải tổng dữ liệu của mainjs đã ghi trong `README.md`: [Sự kiện tải dữ liệu, hành động SAU khi đã tải](#sự-kiện-tải-dữ-liệu-hành-động-sau-khi-đã-tải), nếu không hiểu thì hỏi chứ không viết lại.

- Các hàm thao tác ghi dữ liệu `thêm/sửa/xoá____[sanPham]|[nguoiDung]|...` không tự kiểm tra object dữ liệu truyền vào có đúng format không. PHẢI ĐỌC file dữ liệu để xem mẫu format của 1 object và tạo chính xác object để truyền vào.

  - RIÊNG sản phẩm, thì chỉ cần id, name, desc, giá gốc, giá giảm và file name hình ảnh (lưu ý đọc key các trường của object trong file dữ liệu)
  - nếu nói xài hàm ghi dữ liệu hơi khó hiểu:
    -Tạo object dữ liệu (vd hoá đơn) giống format của 1 object hoá đơn nằm trong file hoa-don.json (dữ liệu trong file là 1 array các hoá đơn)

- dùng thư viện \*fontawesome để lấy icon thì thầy cho phép

  - ![thay cho phep font awesome](images/chophepfontawesome.png)

- ngoài ra, trong trang admin và trang index mẫu có 1 số các form dùng để lọc/sắp xếp dữ liệu, bạn/các bạn làm form/giao diện vô xem qua và style lại form

- đến hiện tại `Fri Nov 29 2024 21:21:43 GMT+0700 (Indochina Time)`, các file main.js/index mẫu/các trang admin đều vẫn là chưa làm xong và vẫn đang đc code thêm vào. Nên lưu ý, nếu xài git không được, thì cố gắng cập nhật bằng tay. HẠN CHẾ copy code về file của mình, vì có thể nó còn chưa xong và sẽ đc sửa lại

</details>

## thông báo tin chung

<details open>

<summary>an noi dung da dc hien len</summary>

1. toan bo link phai xai relative path vi host bang github pages nếu xài link kiểu này /index.html sẽ bị lỗi

2. quyết định mà giỏ hàng lưu 1 mảng riêng chứ k lưu trong người dùng là để thuận tiện cho xử lý form thêm và sửa người dùng

3. bắt buộc phải gọi hàm tim/them/xoa/sua hàm của dữ liệu vì đã có viết xử lý trong đấy rồi, đừng tự thao tác lên mảng toàn cục g_

</details>

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

### Update pagination mới

- ko còn phải tải lại trang khi chuyển page

<details open>

<summary>an noi dung da dc hien len</summary>

- Xem cáh làm tính và hiển thị mới:
  - ![image](https://github.com/user-attachments/assets/e805e4dd-63d5-4cd4-af0c-39e0115f0d7e)
  - ![image](https://github.com/user-attachments/assets/5b8e18ae-8606-48b5-aab9-393a989ce37c)
  - ![image](https://github.com/user-attachments/assets/d43e250f-4794-4f24-8bd4-e1f67763c3f3)
  - ![image](https://github.com/user-attachments/assets/9e300b7a-bf86-439d-940e-17fc07846639)

</details open>

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

### Popup, modal, popover, overlays, popups, popovers, dialogs, etc

- vì môn ko cho xài thư viện, dùng https://developer.mozilla.org/en-US/docs/Web/API/Popover_API, ,do trình duyệt hỗ trợ để tạo Popup, modal, popover, overlays, popups, popovers, dialogs, etc (https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/popover)

<details>

<summary>hien noi dung da dc an di</summary>

1. ví dụ modal dialog (mờ nền, ko bấm đc đằng sau, bấm ESC để tắt)
2. ![image](https://github.com/user-attachments/assets/8d5dd1e4-c381-495d-8bf6-697b0e07ba6f)
3. code liên quan:

    ```javascript
    function showDebugMenu() {
      const existingDialog = document.getElementById("debugDialog");
      if (existingDialog) {
        existingDialog.showModal();
        return;
      }
      // Create the dialog element
      const dialog = document.createElement("dialog");
      dialog.id = "debugDialog";
      dialog.style.width = "calc(100% - 200px)";
      dialog.style.height = "calc(100% - 100px)";
      dialog.style.padding = "20px";
      document.body.appendChild(dialog);

      const closeButton = document.createElement("button");
      closeButton.textContent = "Close";
      closeButton.style.float = "right";
      closeButton.onclick = () => dialog.close();
      dialog.appendChild(closeButton);
    
      const title = document.createElement("h2");
      title.textContent = "Debug menu for Web 1 Best Bag";
      dialog.appendChild(title);

      // ...
      dialog.showModal();
    }
    ```
4. ví dụ popover (ko mờ nền, bấm đằng sau/ESC để tắt
5. ![image](https://github.com/user-attachments/assets/1c5a738c-d3c6-43a5-aca9-12293306a9cd)
6. ![image](https://github.com/user-attachments/assets/5f569f10-58a9-483b-be37-221c6850f7b5)
7. code liên quan:

  - Toggle bằng tay

    ```javascript
    const popover = document.createElement("div");
    popover.classList.add("popover");
    popover.setAttribute("popover", "auto");
    dialog.appendChild(popover);
  
    // Show popover message
    function showPopover(message) {
      popover.textContent = message;
      popover.showPopover();
    }

    const downloadLocalStorageButton = createButton(
    "Download Local Storage",
    () => {
      downloadFile("localstorage.json", JSON.stringify(localStorage));
      showPopover("Local Storage: Downloaded Local Storage");
    }
    );
    dialog.appendChild(downloadLocalStorageButton);
    ```

  - Toggle tự động bằng action lên 1 phần tử (nhấn nút, check box, v.v)  

    ```javascript
    const wrapper = document.querySelector(wrapperSelector);
    wrapper.innerHTML = "";
    const popover = (function () {
      // Create the form element
      const form = document.createElement("form");
      form.classList.add("pagination-popover");
      form.popover = "auto";
      form.addEventListener("toggle", (e) => {
        if (e.newState == "open") input.focus();
      });
      form.addEventListener("submit", () =>
        onPaginationChange(new FormData(form).get("page"))
      );
  
      // Create the label element
      const label = document.createElement("label");
      label.setAttribute("for", "page");
      label.textContent = "Go to Page...";
  
      // Create the input element
      const input = document.createElement("input");
      input.setAttribute("name", "page");
      input.setAttribute("type", "number");
      input.setAttribute("step", 1);
      input.setAttribute("min", 1);
      input.setAttribute("max", soPageToiDa);
  
      // Create the button element
      const button = document.createElement("button");
      button.setAttribute("type", "submit");
      button.textContent = "Go";
  
      // Append the elements to the form
      form.appendChild(label);
      form.appendChild(document.createElement("br")); // Line break for spacing
      form.appendChild(input);
      form.appendChild(button);
  
      // Append the form to the body (or any other container)
      return form;
    })();
    wrapper.appendChild(popover);
    
    // ham them nhanh dau 3 cham (e.g. 1 ... 5 6 7)
    function addEllipsis() {
      const li = document.createElement("li");
      const ellipsis = document.createElement("button");
      ellipsis.textContent = "…";
      ellipsis.style.setProperty("font-weight", "bold");
      ellipsis.popoverTargetElement = popover;
      ellipsis.popoverTargetAction = "toggle";
      li.appendChild(ellipsis);
      container.appendChild(li);
    }
    ```

- Browser compatibility (né safari ra)
  - ![image](https://github.com/user-attachments/assets/2bc4b56a-3c7f-4a3e-a61d-812ccd4c6a30)
  - ![image](https://github.com/user-attachments/assets/7f15a356-6f4d-4b28-b45a-52d98c5d6833)

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
