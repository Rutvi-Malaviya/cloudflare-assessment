addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
/**
 * Respond with hello worker text
 * @param {Request} request
 */

class Link {
  constructor(name, url) {
    this.name = name;
    this.url = url;
  }

  getName() {
    return this.name;
  }

  getUrl() {
    return this.url;
  }
}


class LinksTransformer {
  constructor(links) {
    this.links = links;
  }

  element = (element) => {
    let content = "";

    for (let index = 0; index < this.links.length; index++) {
      content += `<a href='${this.links[index].getUrl()}'>${this.links[index].getName()}</a>`;
    }

    element.setInnerContent(content, { html: true });
  };
}

class ProfileTransformer {
  constructor(name, avatar) {
    this.name = name;
    this.avatar = avatar;
  }

  element = (element) => {
    switch (element.tagName) {
      case 'div':
        element.setAttribute('style', "");
        break;

      case 'img':
        element.setAttribute('src', this.avatar);
        break;

      case 'h1':
        element.setInnerContent(this.name);
        break;

      default:
        break;
    }
  };
}

class TitleTransformer {
  constructor(title) {
      this.title = title;
  }

  element = (element) => {
    element.setInnerContent(this.title);
  };
}

class BodyTransformer {
  constructor(bgcolor) {
      this.bgcolor = bgcolor;
  }

  element = (element) => {
    element.setAttribute('class',this.bgcolor)
  };
}

const handleRequest = async (request) => {
  let links = [new Link('Github', 'https://github.com/Rutvi-Malaviya'), new Link('linkedin', 'http://www.linkedin.com/in/rutvi-malaviya'), new Link('facebook', 'http://www.facebook.com')];

  const url = new URL(request.url);
  if (url.pathname === '/links') {
    return new Response(JSON.stringify(links), {
      headers: {
        "content-type": "application/json;charset=UTF-8"
      }
    });
  }
  else {
    let page = await fetch("https://static-links-page.signalnerve.workers.dev");
    let resp =  new HTMLRewriter().on("div#links",new LinksTransformer(links)).transform(page);
    const profileAvatar = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.linkedin.com%2Fchatin%2Fwnc%2Fin%2Frutvi-malaviya%3Ftrk%3Dpeople_also_view_5&psig=AOvVaw1uTt0Bf_3AvADYnCofZEeL&ust=1603250373409000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCLCiuZybwuwCFQAAAAAdAAAAABAD'
    const userName = 'Rutvi Malaviya'
    resp = new HTMLRewriter().on("div#profile",new ProfileTransformer(userName,profileAvatar)).on('img',new ProfileTransformer(userName,profileAvatar)).on('h1', new ProfileTransformer(userName,profileAvatar)).on('img',new ProfileTransformer('Rutvi',profileAvatar)).transform(resp);
    resp = new HTMLRewriter().on("title",new TitleTransformer("Rutvi Malaviya")).transform(resp);
    resp = new HTMLRewriter().on("body", new BodyTransformer("bg-yellow-500")).transform(resp);
    return resp;
  }

};
