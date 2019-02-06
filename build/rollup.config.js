"use strict"

const path    = require("path");
const babel   = require("rollup-plugin-babel");
const resolve = require("rollup-plugin-node-resolve");

module.exports = {
  input: path.resolve(__dirname, "../src/javascripts/selectarr.js"),
  output: {
    file: path.resolve(__dirname, "../dist/javascripts/selectarr.js"),
    format: "umd",
    name: "selectarr",
  },
  plugins: [
    resolve(),
    babel({
      exclude: "node_modules/**",
    })
  ]
}