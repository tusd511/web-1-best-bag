// Lấy thông tin người dùng và điền vào form
function layThongTinUser() {
  // Lấy ID người dùng từ localStorage
  const id = localStorage.getItem('currentUserId');

  // Kiểm tra xem có ID không
  if (!id) {
    alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
    return;
  }

  // Tìm người dùng (giả sử có hàm timNguoiDung từ backend hoặc localStorage)
  const user = timNguoiDung(id);

  console.log("Thông tin user: ", user);

  // Kiểm tra xem người dùng có tồn tại không
  if (!user) {
    alert('Không tìm thấy thông tin tài khoản.');
    return;
  }

  // Điền thông tin vào các trường input
  document.getElementById('infoname').value = user.name || '';
  document.getElementById('infoemail').value = user.email || '';
  document.getElementById('infousername').value = user.username || '';
}

window.addEventListener('load', () => {
  taiDuLieuTongMainJs(() => taiNguoiDung(() => {
    console.log("OnLoad")
    // Lấy thông tin người dùng khi trang được tải
    layThongTinUser();

  }))
})


// Hàm thay đổi thông tin người dùng
function changeInformation() {
  // Lấy giá trị từ các trường input
  const name = document.getElementById('infoname').value;
  const email = document.getElementById('infoemail').value;
  const username = document.getElementById('infousername').value;

  // Lấy ID người dùng
  const id = localStorage.getItem('currentUserId');

  // Kiểm tra xem có ID không
  if (!id) {
    alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
    return;
  }

  // Kiểm tra xem người dùng có tồn tại không
  const user = timNguoiDung(id);
  if (!user) {
    alert('Không tìm thấy thông tin tài khoản.');
    return;
  }

  // Kiểm tra xem người dùng có thay đổi thông tin không
  if (name === user.name && email === user.email) {
    alert('Không có thông tin nào thay đổi');
    return;
  }

  // Kiểm tra validation (ví dụ: email)
  if (email && !validateEmail(email)) {
    document.querySelector('.inforemail-error').textContent = 'Email không hợp lệ';
    return;
  }

  // Cập nhật thông tin người dùng
  suaNguoiDung(id, {
    name: name,
    email: email,
    username: username
  });

  const ttmoi = timNguoiDung(id);
  console.log("Thông tin mới: ", ttmoi);

  alert('Cập nhật thông tin thành công');
}

// Hàm thay đổi mật khẩu
function changePassword() {
  // Lấy giá trị các trường mật khẩu
  const matKhauHienTai = document.getElementById('password-cur-info').value;
  const matKhauMoi = document.getElementById('password-after-info').value;
  const xacNhanMatKhauMoi = document.getElementById('password-comfirm-info').value;

  // Lấy ID người dùng
  const id = localStorage.getItem('currentUserId');

  // Validate mật khẩu
  const passwordErrors = validatePassword(matKhauHienTai, matKhauMoi, xacNhanMatKhauMoi);

  // Hiển thị lỗi nếu có
  document.querySelector('.password-cur-info-error').textContent = passwordErrors.matKhauHienTai || '';
  document.querySelector('.password-after-info-error').textContent = passwordErrors.matKhauMoi || '';
  document.querySelector('.password-after-comfirm-error').textContent = passwordErrors.xacNhanMatKhau || '';

  // Nếu có lỗi, dừng việc thực thi
  if (passwordErrors.matKhauHienTai || passwordErrors.matKhauMoi || passwordErrors.xacNhanMatKhau) {
    return;
  }

  // Thực hiện đổi mật khẩu
  suaNguoiDung(id, {
    password: matKhauMoi
  });
  alert('Đổi mật khẩu thành công');

  console.log("Mật khẩu mới: ", timNguoiDung(id).password);

  // Xóa các trường mật khẩu sau khi đổi thành công
  document.getElementById('password-cur-info').value = '';
  document.getElementById('password-after-info').value = '';
  document.getElementById('password-comfirm-info').value = '';
}

// Hàm validate email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Hàm validate mật khẩu
function validatePassword(matKhauHienTai, matKhauMoi, xacNhanMatKhauMoi) {
  const errors = {};

  // Kiểm tra mật khẩu hiện tại
  if (!matKhauHienTai) {
    errors.matKhauHienTai = 'Vui lòng nhập mật khẩu hiện tại';
  }

  // Kiểm tra mật khẩu mới
  if (!matKhauMoi) {
    errors.matKhauMoi = 'Vui lòng nhập mật khẩu mới';
  } else if (matKhauMoi.length < 6) {
    errors.matKhauMoi = 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  // Kiểm tra xác nhận mật khẩu
  if (!xacNhanMatKhauMoi) {
    errors.xacNhanMatKhau = 'Vui lòng xác nhận mật khẩu mới';
  } else if (matKhauMoi !== xacNhanMatKhauMoi) {
    errors.xacNhanMatKhau = 'Mật khẩu xác nhận không khớp';
  }

  return errors;
}
