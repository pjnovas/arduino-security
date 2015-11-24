module.exports = {
  assets: {
    files: [
      {
        expand: true,
        cwd: 'dist/',
        src: ['**/*.js'],
        dest: '../public/js/',
        rename: function(dest, src) {
          return dest + src;
        }
      }
    ]
  }
};
