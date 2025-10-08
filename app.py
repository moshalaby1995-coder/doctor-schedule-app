import streamlit as st
import pandas as pd
import os
from datetime import datetime, timedelta

# اسم ملف الإكسل الذي سيخزن الحجوزات
excel_name = 'جدول_نبطشيات_نوفمبر.xlsx'

# إنشاء قائمة الأيام لشهر نوفمبر 2025
start_date = datetime(2025, 11, 1)
days = [(start_date + timedelta(days=i)).strftime('%A %d-%m-%Y') for i in range(30)]

# ترجمة الأيام إلى العربية
days_ar = {
    'Saturday': 'السبت',
    'Sunday': 'الأحد',
    'Monday': 'الاثنين',
    'Tuesday': 'الثلاثاء',
    'Wednesday': 'الأربعاء',
    'Thursday': 'الخميس',
    'Friday': 'الجمعة'
}
days = [days_ar.get(d.split()[0], d.split()[0]) + ' ' + d.split()[1] for d in days]

# تحميل أو إنشاء ملف Excel محلي
if os.path.exists(excel_name):
    df = pd.read_excel(excel_name)
else:
    df = pd.DataFrame({
        'اليوم': days,
        'نبطشيه (8 ص - 8 م)': [None]*30,
        'سهر (8 م - 8 ص)': [None]*30
    })
    df.to_excel(excel_name, index=False)

# واجهة المستخدم
st.set_page_config(page_title="جدول النبطشيات", page_icon="📅", layout="centered")

st.title('📅 جدول نبطشيات وسهرات شهر نوفمبر 2025')
st.markdown("### 🧑‍⚕️ برجاء اختيار اليوم والشيفت ثم إدخال الاسم لحجزك")

day = st.selectbox('اختر اليوم', df['اليوم'])
shift = st.radio('اختر الشيفت المطلوب', ['نبطشيه (8 ص - 8 م)', 'سهر (8 م - 8 ص)'])
name = st.text_input('اسم الطبيب')

if name:
    idx = df[df['اليوم'] == day].index[0]

    # لو الشيفت فاضي
    if pd.isna(df.loc[idx, shift]):
        if st.button('✅ تأكيد الحجز'):
            df.loc[idx, shift] = name
            df.to_excel(excel_name, index=False)
            st.success(f'✅ تم الحجز بنجاح ليوم {day} - {shift} للطبيب {name}')
    else:
        st.error('⚠️ هذا الشيفت محجوز بالفعل، برجاء اختيار يوم آخر أو شيفت آخر.')
else:
    st.info('ℹ️ أدخل اسمك أولًا لإتمام الحجز.')

# لا يتم عرض الجدول للمستخدمين
st.markdown("---")
st.caption("🧠 تم تصميم هذه الصفحة لحجز النبطشيات فقط. لا يمكن عرض الجدول العام هنا.")
