(()=>{"use strict";let e=function(e){return e.GET_DOM="GET_DOM",e.SCROLL_INTO_IMAGE="SCROLL_INTO_IMAGE",e.SCROLL_INTO_VIDEO="SCROLL_INTO_VIDEO",e.VIEW_IMAGE="VIEW_IMAGE",e.COLLECT_IMAGE="COLLECT_IMAGE",e.CTX_MENU_COLLECT_IMAGE="CTX_MENU_COLLECT_IMAGE",e.CTX_SHOW_VIDEO="CTX_SHOW_VIDEO",e.CTX_MARK_IMAGE="CTX_MARK_IMAGE",e.CTX_JUST_SHOW_VIDEO="CTX_JUST_SHOW_VIDEO",e.CTX_JUST_SHOW_IMAGE="CTX_JUST_SHOW_IMAGE",e.CTX_SHOW_IMAGE_MINIMAP="CTX_SHOW_IMAGE_MINIMAP",e.CTX_SHOW_IMAGE_VIEWER="CTX_SHOW_IMAGE_VIEWER",e}({});chrome.runtime.onInstalled.addListener((()=>{chrome.contextMenus.create({id:e.VIEW_IMAGE,title:"View image",contexts:["image"]}),chrome.contextMenus.create({id:e.CTX_SHOW_VIDEO,title:"Show Video",contexts:["all"]}),chrome.contextMenus.create({id:e.CTX_MARK_IMAGE,title:"Mark image",contexts:["image"]}),chrome.contextMenus.create({id:e.CTX_JUST_SHOW_VIDEO,title:"Just show video",contexts:["all"]}),chrome.contextMenus.create({id:e.CTX_JUST_SHOW_IMAGE,title:"Just show image",contexts:["all"]}),chrome.contextMenus.create({id:e.CTX_SHOW_IMAGE_MINIMAP,title:"Show minimap of image",contexts:["all"]}),chrome.contextMenus.create({id:e.CTX_SHOW_IMAGE_VIEWER,title:"Show image viewer",contexts:["all"]})})),chrome.contextMenus.onClicked.addListener(((e,_)=>{null!==_&&void 0!==_&&_.id&&chrome.tabs.sendMessage(_.id,{type:e.menuItemId,data:e.srcUrl})}))})();
//# sourceMappingURL=background.js.map