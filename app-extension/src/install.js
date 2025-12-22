export default function (api) {
  api.onExitLog(`
             _               _    _
     __ _ __| |_ ___ _ _ ___(_)__| |
    / _\` (_-<  _/ -_) '_/ _ \\ / _\` |
    \\__,_/__/\\__\\___|_| \\___/_\\__,_|
    ~+    INSTALAÇÃO CONCLUÍDA    +~
  `)

  // -------------------------- CSS: quasar.variables.scss --------------------------
  api.renderFile(
    './templates/css/quasar.variables.scss', // caminho do arquivo importado
    'src/css/quasar.variables.scss' // caminho do arquivo que será criado no projeto
  )

  // -------------------------- JS: asteroid.config.js -------------------------------
  api.renderFile(
    './templates/js/asteroid.config.js', // caminho do arquivo importado
    'asteroid.config.js' // caminho do arquivo que será criado no projeto
  )
}
