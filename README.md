# BL3SS para GitHub Pages — sem subpastas

[Crie um repositório no GitHub](https://github.com/new) ou abra o que você já tem. Este ZIP contém 96 arquivos, todos no mesmo nível. Não precisa enviar pastas, usar Git no terminal ou instalar nada.

1. Extraia o ZIP. No seu repositório, vá a **Add file → Upload files → choose your files**.
2. Entre na pasta extraída **na janela de seleção** e aperte **Ctrl+A** para escolher os arquivos. Envie todos juntos, sem enviar a pasta nem o arquivo `.zip`. Se já tiver um `index.html` antigo, estes arquivos vão substituí-lo.
3. Confirme em **Commit changes**. Se o commit foi para outra branch, faça o merge para a branch que vai publicar.
4. Em **Settings → Pages**, escolha **Deploy from a branch → main → /(root)** e salve. Abra a URL publicada que aparece lá.

## Endereços diretos

Troque `USUARIO` e `REPO` pelos nomes que aparecem na URL do repositório (se a branch não for `main`, troque-a no endereço de upload).

- Upload: `https://github.com/USUARIO/REPO/upload/main`
- Configurações do Pages: `https://github.com/USUARIO/REPO/settings/pages`
- Site publicado: normalmente `https://USUARIO.github.io/REPO/`

[Ajuda oficial de upload](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository) · [Como ativar o Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Editar depois

`index.html` é a estrutura; `style.css`, o visual; `app.js`, o comportamento; `catalogo.js`, os jogos e as músicas. `.webp`, `.woff2`, `.png` e `.svg` são arquivos usados pelo site: mantenha-os junto do HTML. Para trocar a capa de um jogo, adicione `minha-capa.webp` ao repositório e use `"minha-capa"` no campo `cover` daquele jogo em `catalogo.js`.

Os jogos e o catálogo do BlessSounds dependem das respectivas fontes externas. As licenças OFL de Inter e Space Grotesk estão nos arquivos `*-OFL.txt`. Capas e mídias pertencem aos autores originais.
