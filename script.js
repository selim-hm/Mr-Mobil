// كود JavaScript لموقع Mr Mobile

// انتظار تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. تحديث سنة حقوق النشر تلقائيًا
    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
    
    // 2. تفعيل القائمة المتنقلة على الأجهزة المحمولة
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // إغلاق القائمة عند النقر على رابط
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // تحديث الرابط النشط
            document.querySelectorAll('.nav-link').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // 3. التحقق من نموذج الاتصال قبل الإرسال
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formMessage = document.getElementById('formMessage');
            formMessage.style.display = 'none';
            formMessage.className = 'form-message';

            // الحصول على قيم الحقول
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            // التحقق من صحة البيانات
            if (!name || !phone || !message) {
                formMessage.textContent = 'الرجاء ملء جميع الحقول المطلوبة.';
                formMessage.classList.add('error');
                formMessage.style.display = 'block';
                return;
            }

            // تحقق عام لرقم الهاتف (يسمح بأرقام دولية مع رموز بسيطة)
            const phoneRegex = /^[+0-9()\-\s]{6,}$/;
            if (!phoneRegex.test(phone)) {
                formMessage.textContent = 'الرجاء إدخال رقم هاتف صحيح.';
                formMessage.classList.add('error');
                formMessage.style.display = 'block';
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            const origText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'جاري الإرسال...';

            try {
                const formData = new FormData(contactForm);

                // إرسال عبر Fetch - نطلب استجابة JSON من FormSubmit
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // نجاح: رسالة داخلية للمستخدم
                    formMessage.textContent = 'تم إرسال الرسالة بنجاح. شكرًا لتواصلك معنا!';
                    formMessage.classList.add('success');
                    formMessage.style.display = 'block';
                    contactForm.reset();
                } else {
                    // قد يحدث رفض بسبب CORS أو خطأ آخر؛ نجرب الإرسال التقليدي (native submit)
                    formMessage.textContent = 'تعذّر إرسال الرسالة عبر JavaScript. سيتم إعادة محاولة الإرسال بالطريقة التقليدية.';
                    formMessage.classList.add('error');
                    formMessage.style.display = 'block';
                    setTimeout(() => contactForm.submit(), 800);
                }
            } catch (err) {
                // عادة يحدث هذا عند قيود CORS أو مشاكل شبكة - نعيد المحاولة بطريقة native
                formMessage.textContent = 'خطأ في الاتصال. سيتم إرسال النموذج بالطريقة التقليدية (في حالة وجود قيود CORS).';
                formMessage.classList.add('error');
                formMessage.style.display = 'block';
                setTimeout(() => contactForm.submit(), 800);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = origText;
            }
        });
    }
    
    // 4. إضافة تأثير التمرير السلس للروابط الداخلية
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // حساب الموقع مع مراعاة الهيدر الثابت
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 5. إضافة تأثير التمرير لتحديد القسم النشط في القائمة
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const headerHeight = document.querySelector('.header').offsetHeight;
            
            if (scrollY >= (sectionTop - headerHeight - 100)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
    
    // 6. إضافة تأثير الظهور التدريجي للعناصر عند التمرير
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // مراقبة العناصر التي نريد إضافة تأثير لها
    document.querySelectorAll('.service-card, .about-content, .contact-content').forEach(el => {
        observer.observe(el);
    });
    
    // 7. إضافة تأثير بسيط للبطاقات عند التمرير
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
});