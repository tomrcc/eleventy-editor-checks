import editableRegions from "@cloudcannon/editable-regions/eleventy";
import markdownIt from "markdown-it";

const md = markdownIt({ html: true });

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(editableRegions);

  // Markdown filter for template fields. Deliberately not named renderContent.
  eleventyConfig.addFilter("markdown", function (value) {
    return md.render(value || "");
  });

  // Shortcodes used in content (snippet checks).
  eleventyConfig.addShortcode("badge", function (label) {
    return `<span class="badge">${label}</span>`;
  });
  eleventyConfig.addShortcode("pill", function (label, colour) {
    return `<span class="pill" data-colour="${colour}">${label} / ${colour}</span>`;
  });
  eleventyConfig.addShortcode("unconfigured", function (label) {
    return `<span class="unconfigured">${label}</span>`;
  });

  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    dir: { input: "src", output: "_site" },
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
  };
}
