module.exports = {
  webpack: {
    configure: (config) => {
      // 1) disable splitting so we get one JS file
      config.optimization.splitChunks = false;
      config.optimization.runtimeChunk = false;

      // 2) fix output names
      config.output.filename = 'static/js/bundle.js';
      config.output.chunkFilename = 'static/js/bundle.js';

      // 3) (optional) single CSS file too
      const MiniCssExtractPlugin = config.plugins.find(
        p => p.constructor && p.constructor.name === 'MiniCssExtractPlugin'
      );
      if (MiniCssExtractPlugin) {
        MiniCssExtractPlugin.options.filename = 'static/css/bundle.css';
        MiniCssExtractPlugin.options.chunkFilename = 'static/css/bundle.css';
      }
      return config;
    }
  }
};
