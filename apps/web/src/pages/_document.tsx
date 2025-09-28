import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import { TABLES } from '@/config/database'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="pt-BR" className="min-h-full">
        <Head />
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('${TABLES.THEME}');
                  var theme = stored ? stored : 'dark';
                  if (theme === 'dark') document.documentElement.classList.add('dark');
                } catch (e) {}
              })();
            `}}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument


