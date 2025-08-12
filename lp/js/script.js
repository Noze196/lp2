
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const totalSlides = slides.length;
    document.addEventListener('DOMContentLoaded', () => {
        const dialog = document.getElementById('imageDialog');
        const dialogImage = document.getElementById('dialogImage');
        const dialogCaption = document.getElementById('dialogCaption');
        const closeBtn = document.getElementById('closeDialog');

        // 点击图片打开弹窗
        document.querySelectorAll('.gallery-item img').forEach(img => {
            img.addEventListener('click', () => {
                openDialog(img.src, img.alt);
            });
        });

        // 打开弹窗
        function openDialog(src, alt) {
            dialogImage.src = src;
            dialogCaption.textContent = alt;
            dialog.showModal();
        }

        // 关闭按钮点击事件
        closeBtn.addEventListener('click', () => {
            dialog.close();
        });

        // 点击背景区域关闭弹窗
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.close();
            }
        });
    });


    function showSlide(index) {
        // 移除所有active类
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // 确保索引在有效范围内
        if (index >= totalSlides) slideIndex = 0;
        if (index < 0) slideIndex = totalSlides - 1;

        // 移动轮播图
        const slidesContainer = document.querySelector('.carousel-slides');
        slidesContainer.style.transform = `translateX(-${slideIndex * 100}%)`;

        // 添加active类
        slides[slideIndex].classList.add('active');
        indicators[slideIndex].classList.add('active');
    }

    function changeSlide(direction) {
        slideIndex += direction;
        showSlide(slideIndex);
    }

    function currentSlide(index) {
        slideIndex = index - 1;
        showSlide(slideIndex);
    }

    // 自动轮播
    setInterval(() => {
        slideIndex++;
        showSlide(slideIndex);
    }, 5000);

    // 初始化
    showSlide(slideIndex);
    // 表单提交处理
    document.getElementById('bookingForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const submitBtn = document.querySelector('.form-submit-btn');
        const messageDiv = document.getElementById('formMessage');

        // 显示加载状态
        submitBtn.textContent = '提交中...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.get('name'),
                    phone: formData.get('phone'),
                    message: formData.get('message'),
                    timestamp: new Date().toISOString()
                })
            });

            const result = await response.json();

            if (response.ok) {
                // 成功提交
                messageDiv.className = 'form-message success';
                messageDiv.textContent = '提交成功！我们会尽快与您联系。';
                messageDiv.style.display = 'block';

                // 清空表单
                this.reset();
            } else {
                throw new Error(result.message || '提交失败');
            }
        } catch (error) {
            // 提交失败
            messageDiv.className = 'form-message error';
            messageDiv.textContent = '提交失败，请稍后重试或通过WhatsApp联系我们。';
            messageDiv.style.display = 'block';
            console.error('表单提交错误:', error);
        } finally {
            // 恢复按钮状态
            submitBtn.textContent = '提交';
            submitBtn.disabled = false;

            // 3秒后隐藏消息
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
        }
    });

    // 电话号码格式验证
    document.getElementById('customerPhone').addEventListener('input', function (e) {
        const phone = e.target.value;
        const phoneRegex = /^[+]?[\d\s-()]+$/;

        if (phone && !phoneRegex.test(phone)) {
            e.target.setCustomValidity('请输入有效的电话号码');
        } else {
            e.target.setCustomValidity('');
        }
    });


