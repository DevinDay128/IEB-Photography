import streamlit as st
import streamlit.components.v1 as components
import base64
import os

st.set_page_config(
    page_title="IEB Photography",
    page_icon="📸",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Hide Streamlit default elements for full-page experience
st.markdown("""
    <style>
        #MainMenu {visibility: hidden;}
        footer {visibility: hidden;}
        header {visibility: hidden;}
        .block-container {
            padding: 0 !important;
            max-width: 100% !important;
        }
        iframe {
            border: none !important;
        }
    </style>
""", unsafe_allow_html=True)

def get_base64_image(image_path):
    """Convert image to base64 data URI"""
    with open(image_path, "rb") as f:
        data = base64.b64encode(f.read()).decode()
    ext = os.path.splitext(image_path)[1].lower()
    mime = "image/jpeg" if ext in [".jpg", ".jpeg"] else "image/png"
    return f"data:{mime};base64,{data}"

# Read the HTML file
with open("index.html", "r") as f:
    html_content = f.read()

# Read CSS file and embed it
with open("css/styles.css", "r") as f:
    css_content = f.read()

# Read JS file and embed it
with open("js/main.js", "r") as f:
    js_content = f.read()

# Convert images to base64 and replace paths in HTML
image_files = [
    "images/about.jpg",
    "images/portfolio-1.jpg",
    "images/portfolio-2.jpg",
    "images/portfolio-3.jpg",
    "images/portfolio-4.jpg",
    "images/portfolio-5.jpg",
    "images/portfolio-6.jpg",
    "images/portfolio-7.jpg",
    "images/portfolio-8.jpg",
]

for img_path in image_files:
    if os.path.exists(img_path):
        base64_data = get_base64_image(img_path)
        html_content = html_content.replace(f'src="{img_path}"', f'src="{base64_data}"')

# Convert hero and banner images in CSS
if os.path.exists("images/hero.jpg"):
    hero_base64 = get_base64_image("images/hero.jpg")
    css_content = css_content.replace(
        "url('../images/hero.jpg')",
        f"url('{hero_base64}')"
    )

if os.path.exists("images/banner.jpg"):
    banner_base64 = get_base64_image("images/banner.jpg")
    css_content = css_content.replace(
        "url('../images/banner.jpg')",
        f"url('{banner_base64}')"
    )

# Inject CSS and JS inline
html_content = html_content.replace(
    '<link rel="stylesheet" href="css/styles.css">',
    f'<style>{css_content}</style>'
)

html_content = html_content.replace(
    '<script src="js/main.js"></script>',
    f'<script>{js_content}</script>'
)

# Render the full HTML page
components.html(html_content, height=5000, scrolling=True)
