import streamlit as st
import streamlit.components.v1 as components

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

# Read the HTML file
with open("index.html", "r") as f:
    html_content = f.read()

# Read CSS file and embed it
with open("css/styles.css", "r") as f:
    css_content = f.read()

# Read JS file and embed it
with open("js/main.js", "r") as f:
    js_content = f.read()

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
components.html(html_content, height=800, scrolling=True)
