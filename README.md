# jetstack-website
[![Netlify Status](https://api.netlify.com/api/v1/badges/460632c3-eea0-42c2-962c-205d6de03a8e/deploy-status)](https://app.netlify.com/sites/jetstack-website/deploys)

Hugo build for https://www.jetstack.io

## Local Development

You will require a local version of Docker.

To serve the site in a browser with live updates:

```bash
$ make hugo_serve
$ open http://localhost:1313
```

## Deployment

Jetstack runs on Netlify. Netlify will listen for pull requests. When a pull request has opened, Netlify will deploy it providing a preview link.
Master branch is considered production therefore any changes to `master` will notify Netlify to deploy those changes.

## Site Structure

The main 2 ways to control the content are:

 * edit the config file: `data/config.yaml`
 * add/edit a Markdown file to a section inside `content`

#### Config driven sections

The `Kubernetes` and `Homepage` are special in that they use various partials from `layouts/partials/panels` and data from `data/config.toml`.

The layout for each section is controlled by `layouts/section/SECTION.html` - for example, the Kubernetes page is controlled by: `layouts/section/kubernetes.html`

Here is the block for the Kubernetes page that generates it's content from the various partials and data in `data/config.toml`.  The idea is you can quickly make other pages using a combination of the various panels and different config data.

```
{{ partial "panels/headline.html" .Site.Data.config.headline.kubernetes }}
{{ partial "panels/timeline.html" .Site.Data.config.panels.k8s_timeline }}
{{ partial "panels/image_summary.html" .Site.Data.config.panels.k8s_images }}
{{ partial "panels/k8s_numbers.html" .Site.Data.config.panels.k8s_numbers }}
{{ partial "panels/highlights.html" .Site.Data.config.panels.k8s_highlights }}
{{ partial "panels/paragraph.html" .Site.Data.config.panels.k8s_close }}
```

### Markdown driven sections

The following sections are driven by Markdown files in the `content` folder.  The front-matter for each file depends on what the section does.

The template driving each section:

 * engineering (home) - `layouts/section/engineering.html`
 * engineering (post) - `layouts/engineering/single.html`
 * services - `layouts/section/services.html`
 * about - `layouts/section/about.html`
 * insights - `layouts/section/insights.html`
   * blog - `layouts/_default/section.html`
   * whitepapers - `layouts/_default/section.html`
   * infographics - `layouts/_default/section.html`
   * videos - `layouts/_default/section.html`
   * post (all sections) - `layouts/_default/single.html`

The `date` and `weight` fields control the ordering of the content within the section.

## Markdown Notes

If you include a `youtube` value for insight sections - it will auto-embed the youtube.

If you include a `image` value for insight sections - it will add the image.

Images are saved in `static/img`

## Section Notes

#### Kubernetes

There is a script that scrapes real-time data from the github api for the stats.

There is no way to get a total contributors using the api from a client.  Instead it scrapes the github page HTML (using a CORS proxy) and uses Jquery to extract the value.

## Config Notes

Things that apply to values in the `data/config.yaml` file.

#### Insight Sections

The `insightSections` list controls what posts will appear in the `all` section of insights.

#### Extra newlines

There are some examples where an extra newline is required for a line-break to appear in the browser - here is an example:

```yaml
kubernetes:
  headline: >
    Kubernetes - The De Facto Standard

    in Container Orchestration
  strapline: A culmination of Ten Years of Running Linux Containers At Google
```

#### Headlines

The various titles that appear in each section are controlled by the `headline` section.


#### Panels

The content sections in the homepage and Kubernetes page are controlled by the `panels` section.



