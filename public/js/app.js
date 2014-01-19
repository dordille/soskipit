(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("app", function(exports, require, module) {
var AskRoulette, GlobalView, HomeView, Router, User;

User = require('models/user');

Router = require('lib/router');

HomeView = require('views/home-view');

GlobalView = require('views/global-view');

AskRoulette = (function() {
  function AskRoulette(user) {
    var domDef,
      _this = this;
    if (user) {
      this.user = new User(user);
    }
    this.router = new Router({
      user: this.user
    });
    domDef = $.Deferred();
    this.domReady = domDef.promise();
    this.views = {
      global: new GlobalView(this),
      home: new HomeView(this)
    };
    $(function() {
      domDef.resolve();
      return Backbone.history.start({
        pushState: true
      });
    });
  }

  return AskRoulette;

})();

module.exports = function(user) {
  return window.app = new AskRoulette(user);
};
});

;require.register("lib/router", function(exports, require, module) {
var AnswerView, Ask, AskView, ErrorView, HeaderView, PermaView, Router, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Ask = require('models/ask');

AskView = require('views/ask-view');

AnswerView = require('views/answer-view');

PermaView = require('views/perma-view');

HeaderView = require('views/header-view');

ErrorView = require('views/error-view');

module.exports = Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    _ref = Router.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Router.prototype.routes = {
    '': 'home',
    'ask': 'ask',
    'ask/:id': 'perma',
    'answer': 'answer',
    '*notFound': 'notFound'
  };

  Router.prototype.initialize = function(options) {
    var headerView;
    this.options = options;
    this.askView = new AskView;
    this.answerView = new AnswerView;
    this.errorView = new ErrorView;
    this.user = options.user;
    headerView = new HeaderView({
      model: this.user
    });
    return headerView.render({
      user: this.user
    });
  };

  Router.prototype.navigate = function(route) {
    return Router.__super__.navigate.call(this, route, {
      trigger: true
    });
  };

  Router.prototype.home = function() {
    if (this.user) {
      if (this.user.get('needs_to_ask')) {
        return this.navigate('ask');
      } else {
        return this.navigate('answer');
      }
    } else {
      return app.views.home.render();
    }
  };

  Router.prototype.ask = function() {
    var ask;
    if (!this.user) {
      this.navigate('/');
    }
    if (!this.user.get('needs_to_ask')) {
      this.navigate('answer');
    }
    ask = new Ask;
    ask.set('asker', this.user.toJSON());
    this.askView.model = ask;
    return this.askView.render();
  };

  Router.prototype.answer = function() {
    var req,
      _this = this;
    if (!this.user) {
      this.navigate('/');
    }
    if (this.user.get('needs_to_ask')) {
      this.navigate('ask');
    }
    req = app.user.getCurrentAsk();
    req.done(function(ask) {
      _this.answerView.model = ask;
      return _this.answerView.render();
    });
    return req.fail(function() {
      return _this.errorView.render();
    });
  };

  Router.prototype.perma = function(id) {
    var ask,
      _this = this;
    ask = new Ask({
      id: id
    });
    return ask.fetch().done(function() {
      var view;
      view = new PermaView({
        model: ask
      });
      return view.render();
    }).fail(function() {
      return console.log('fail');
    });
  };

  Router.prototype.notFound = function() {};

  return Router;

})(Backbone.Router);
});

;require.register("models/ask", function(exports, require, module) {
var Ask, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Ask = (function(_super) {
  __extends(Ask, _super);

  function Ask() {
    this.submitAnswer = __bind(this.submitAnswer, this);
    this.submitQuestion = __bind(this.submitQuestion, this);
    _ref = Ask.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Ask.prototype.url = function() {
    return '/ask/' + this.id;
  };

  Ask.prototype.submitQuestion = function(user) {
    var req,
      _this = this;
    req = $.post('/ask', this.attributes);
    req.done(function() {
      return user.set('needs_to_ask', false);
    });
    return req;
  };

  Ask.prototype.submitAnswer = function(user) {
    var req,
      _this = this;
    req = $.post('/answer', this.attributes);
    req.done(function() {
      return user.set('needs_to_ask', true);
    });
    return req;
  };

  return Ask;

})(Backbone.Model);
});

;require.register("models/user", function(exports, require, module) {
var Ask, User, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Ask = require('models/ask');

module.exports = User = (function(_super) {
  __extends(User, _super);

  function User() {
    _ref = User.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  User.prototype.getCurrentAsk = function(fn) {
    var def, req;
    def = $.Deferred();
    req = $.get('/answer');
    req.done(function(data) {
      return def.resolve(new Ask(data));
    });
    req.fail(def.reject.bind());
    return def.promise();
  };

  User.prototype.skipCurrentAsk = function(fn) {
    var def, req;
    def = $.Deferred();
    req = $.post('/ask/skip');
    req.done(function(data) {
      return def.resolve(new Ask(data));
    });
    req.fail(def.reject.bind());
    return def.promise();
  };

  return User;

})(Backbone.Model);
});

;require.register("templates/answer", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),ask = locals_.ask;
buf.push("<div class=\"ask\"><div class=\"question\"><div class=\"tumblelog\"><div class=\"avatar_container\"><div class=\"avatar_frame\"><img" + (jade.attr("src", ask.asker.avatars['64'], true, false)) + " class=\"avatar\"/></div></div><p class=\"tumblelog_name\">" + (jade.escape(null == (jade.interp = ask.asker.username) ? "" : jade.interp)) + "</p></div><div class=\"question_text text\">" + (jade.escape(null == (jade.interp = ask.question_text) ? "" : jade.interp)) + "</div></div><div class=\"response\"><textarea type=\"text\" name=\"response\" class=\"answer_input\"></textarea><div class=\"tumblelog\"><div class=\"avatar_container\"><div class=\"avatar_frame\"><img" + (jade.attr("src", ask.responder.avatars['64'], true, false)) + " class=\"avatar\"/></div></div><p class=\"tumblelog_name\">" + (jade.escape(null == (jade.interp = ask.responder.username) ? "" : jade.interp)) + "</p></div></div><div class=\"buttons\"><button name=\"skip\" value=\"skip\" id=\"skip\" class=\"skip_button\">Skip</button><button name=\"submit\" value=\"submit\" id=\"submit\" class=\"answer_button\">Answer</button></div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("templates/ask", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),ask = locals_.ask;
buf.push("<div class=\"ask\"><div class=\"question\"><div class=\"tumblelog\"><div class=\"avatar_container\"><div class=\"avatar_frame\"><img" + (jade.attr("src", ask.asker.avatars['64'], true, false)) + " class=\"avatar\"/></div></div><p class=\"tumblelog_name\">" + (jade.escape(null == (jade.interp = ask.asker.username) ? "" : jade.interp)) + "</p></div><textarea type=\"text\" name=\"response\" class=\"answer_input\"></textarea></div><div class=\"buttons\"><button name=\"ask\" value=\"ask\" id=\"ask\" class=\"ask_button\">Ask</button></div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("templates/error", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"ask\"><div class=\"question\"><div class=\"question_text text\">You've answered everyone's questions, check back soon for more.</div></div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("templates/global", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<header class=\"header\"></header><div class=\"content\"></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("templates/header", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),user = locals_.user;
buf.push("<div class=\"header\"><a href=\"/\"><div class=\"circle\"><p class=\"title\">So Skip It</p></div></a><div class=\"callout\"><p>Ask a question. Get a question.</p></div><div class=\"user\">");
if ( user)
{
buf.push("<a href=\"/auth/logout\">Logout</a>");
}
else
{
buf.push("<a href=\"/auth/login\">Login</a>");
}
buf.push("</div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("templates/home", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"gif\"><img src=\"/images/skip_it.gif\"/></div><div class=\"login\"><div class=\"login-box\"><a id=\"login\" href=\"/auth/tumblr\">Get Started</a><div class=\"t-icon\"><img src=\"/images/tumblr_logo_white_128.png\"/></div></div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("templates/perma", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),ask = locals_.ask;
buf.push("<div class=\"ask\"><div class=\"question\"><div class=\"tumblelog\"><div class=\"avatar_container\"><div class=\"avatar_frame\"><img" + (jade.attr("src", ask.asker.avatars['64'], true, false)) + " class=\"avatar\"/></div></div><p class=\"tumblelog_name\">" + (jade.escape(null == (jade.interp = ask.asker.username) ? "" : jade.interp)) + "</p></div><div class=\"question_text text\">" + (jade.escape(null == (jade.interp = ask.question_text) ? "" : jade.interp)) + "</div></div><div class=\"response\"><div class=\"tumblelog\"><div class=\"avatar_container\"><div class=\"avatar_frame\"><img" + (jade.attr("src", ask.responder.avatars['64'], true, false)) + " class=\"avatar\"/></div></div><p class=\"tumblelog_name\">" + (jade.escape(null == (jade.interp = ask.asker.username) ? "" : jade.interp)) + "</p></div><div class=\"response_text text\">" + (jade.escape(null == (jade.interp = ask.response_text) ? "" : jade.interp)) + "</div></div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/answer-view", function(exports, require, module) {
var AnswerView, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = AnswerView = (function(_super) {
  __extends(AnswerView, _super);

  function AnswerView() {
    this.skip = __bind(this.skip, this);
    this.submit = __bind(this.submit, this);
    this.viewData = __bind(this.viewData, this);
    _ref = AnswerView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  AnswerView.prototype.el = '#content';

  AnswerView.prototype.templateName = 'answer';

  AnswerView.prototype.events = {
    'click .skip_button': 'skip',
    'click #submit': 'submit'
  };

  AnswerView.prototype.uiMap = _.extend(_.clone(AnswerView.prototype.uiMap), {
    'tape': '.tape',
    'responseText': 'textarea',
    'helpText': '.help-text'
  });

  AnswerView.prototype.initialize = function(app) {
    this.app = app;
  };

  AnswerView.prototype.viewData = function() {
    return {
      ask: this.model.toJSON()
    };
  };

  AnswerView.prototype.submit = function(event) {
    var _this = this;
    event.preventDefault();
    this.model.set('response_text', this.ui.responseText.val());
    this.model.set('responder', app.user.toJSON());
    return this.model.submitAnswer(app.user).done(function() {
      _this.unbind();
      return app.router.navigate('ask');
    });
  };

  AnswerView.prototype.skip = function(event) {
    var _this = this;
    return app.user.skipCurrentAsk().done(function() {
      _this.unbind();
      return app.router.navigate('');
    });
  };

  return AnswerView;

})(require('views/base-view'));
});

;require.register("views/ask-view", function(exports, require, module) {
var AskView, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = AskView = (function(_super) {
  __extends(AskView, _super);

  function AskView() {
    this.ask = __bind(this.ask, this);
    this.viewData = __bind(this.viewData, this);
    _ref = AskView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  AskView.prototype.el = '#content';

  AskView.prototype.templateName = 'ask';

  AskView.prototype.events = {
    'click .skip': 'skip',
    'click .help-button': 'toggleHelp',
    'click #ask': 'ask'
  };

  AskView.prototype.uiMap = _.extend(_.clone(AskView.prototype.uiMap), {
    'tape': '.tape',
    'questionText': 'textarea',
    'helpText': '.help-text'
  });

  AskView.prototype.initialize = function(app) {
    this.app = app;
  };

  AskView.prototype.viewData = function() {
    return {
      ask: this.model.toJSON()
    };
  };

  AskView.prototype.ask = function(event) {
    var _this = this;
    event.preventDefault();
    this.model.set('question_text', this.ui.questionText.val());
    return this.model.submitQuestion(app.user).done(function() {
      _this.unbind();
      return app.router.navigate('answer');
    });
  };

  return AskView;

})(require('views/base-view'));
});

;require.register("views/base-view", function(exports, require, module) {
var BaseView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = BaseView = (function(_super) {
  __extends(BaseView, _super);

  BaseView.prototype.uiMap = {};

  function BaseView() {
    this.render = __bind(this.render, this);
    BaseView.__super__.constructor.apply(this, arguments);
    this.ui = {};
  }

  BaseView.prototype.template = function(data) {
    return require("templates/" + this.templateName)(data);
  };

  BaseView.prototype.viewData = function() {
    return {};
  };

  BaseView.prototype.render = function(data) {
    var key, selector, _ref;
    this.$el.html(this.template(this.viewData()));
    _ref = this.uiMap;
    for (key in _ref) {
      selector = _ref[key];
      this.ui[key] = this.$(selector);
    }
    return this;
  };

  return BaseView;

})(Backbone.View);
});

;require.register("views/error-view", function(exports, require, module) {
var ErrorView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = ErrorView = (function(_super) {
  __extends(ErrorView, _super);

  function ErrorView() {
    _ref = ErrorView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ErrorView.prototype.el = '#content';

  ErrorView.prototype.templateName = 'error';

  ErrorView.prototype.initialize = function(app) {
    this.app = app;
  };

  return ErrorView;

})(require('views/base-view'));
});

;require.register("views/global-view", function(exports, require, module) {
var GlobalView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = GlobalView = (function(_super) {
  __extends(GlobalView, _super);

  function GlobalView() {
    _ref = GlobalView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  GlobalView.prototype.el = '#content';

  GlobalView.prototype.templateName = 'global';

  GlobalView.prototype.events = {
    'click .skip': 'skip',
    'click .help-button': 'toggleHelp'
  };

  GlobalView.prototype.uiMap = _.extend(_.clone(GlobalView.prototype.uiMap), {
    'tape': '.tape',
    'helpText': '.help-text'
  });

  GlobalView.prototype.initialize = function(app) {
    return $.when(app.domReady).then(this.render);
  };

  return GlobalView;

})(require('views/base-view'));
});

;require.register("views/header-view", function(exports, require, module) {
var HeaderView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = HeaderView = (function(_super) {
  __extends(HeaderView, _super);

  function HeaderView() {
    _ref = HeaderView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HeaderView.prototype.el = '#header';

  HeaderView.prototype.templateName = 'header';

  HeaderView.prototype.events = {
    'click .logout': 'logout',
    'click .login': 'login',
    'click .help-button': 'toggleHelp'
  };

  HeaderView.prototype.uiMap = _.extend(_.clone(HeaderView.prototype.uiMap), {
    'tape': '.tape',
    'helpText': '.help-text'
  });

  HeaderView.prototype.initialize = function(app) {};

  HeaderView.prototype.viewData = function() {
    return {
      user: this.model
    };
  };

  HeaderView.prototype.logout = function(app) {};

  HeaderView.prototype.login = function(app) {};

  return HeaderView;

})(require('views/base-view'));
});

;require.register("views/home-view", function(exports, require, module) {
var HomeView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = HomeView = (function(_super) {
  __extends(HomeView, _super);

  function HomeView() {
    _ref = HomeView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HomeView.prototype.el = '#content';

  HomeView.prototype.templateName = 'home';

  HomeView.prototype.events = {
    'click .skip': 'skip',
    'click .help-button': 'toggleHelp'
  };

  HomeView.prototype.uiMap = _.extend(_.clone(HomeView.prototype.uiMap), {
    'tape': '.tape',
    'helpText': '.help-text'
  });

  HomeView.prototype.initialize = function(app) {};

  return HomeView;

})(require('views/base-view'));
});

;require.register("views/perma-view", function(exports, require, module) {
var PermaView, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = PermaView = (function(_super) {
  __extends(PermaView, _super);

  function PermaView() {
    this.submit = __bind(this.submit, this);
    _ref = PermaView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  PermaView.prototype.el = '#content';

  PermaView.prototype.templateName = 'perma';

  PermaView.prototype.events = {
    'click .skip': 'skip',
    'click .help-button': 'toggleHelp',
    'click #submit': 'submit'
  };

  PermaView.prototype.uiMap = _.extend(_.clone(PermaView.prototype.uiMap), {
    'tape': '.tape',
    'questionText': 'input[name="question_text"]',
    'helpText': '.help-text'
  });

  PermaView.prototype.initialize = function(app) {};

  PermaView.prototype.viewData = function() {
    return {
      ask: this.model.toJSON()
    };
  };

  PermaView.prototype.submit = function() {
    this.model.set('question_text', this.ui.questionText.val());
    return this.model.submitQuestion();
  };

  return PermaView;

})(require('views/base-view'));
});

;
//# sourceMappingURL=app.js.map