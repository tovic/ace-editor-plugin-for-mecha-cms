(function(w, d, base) {
    if (!base.editor || !base.editors || !base.editors.length) return;
    function apply(area, i) {
        var hidden = !area || !area.offsetWidth || !area.offsetHeight;
        if (hidden || /(^|\s)ace_editor-active(\s|$)/.test(area.className)) return;
        area.className += ' ace_editor-active';
        var area_ace = d.createElement('div'),
            height = area.offsetHeight * 2,
            id = 'ace-' + (new Date()).getTime() + '-' + i,
            mode = (area.name || 'plain_text').replace('[]', ""),
            editor, name;
        area.style.display = 'none';
        area_ace.id = id;
        area_ace.className += 'ace_editor ace_editor-placeholder';
        area.parentNode.appendChild(area_ace);
        area_ace.style.height = height + 'px';
        // trying to get the file name extension on the page ...
        if (area.name === 'content') { // `<textarea name="content">`
            name = d.getElementsByName('name'); // `<input name="name" type="text">`
            if (name.length && name[0].value.length) {
                mode = base.task.file.E(name[0].value);
            }
        }
        var modes = {
            'archive': 'html',
            'defaults[article_content]': 'html',
            'defaults[article_css]': 'css',
            'defaults[article_js]': 'javascript',
            'defaults[page_content]': 'html',
            'defaults[page_css]': 'css',
            'defaults[page_js]': 'javascript',
            'draft': 'html',
            'hold': 'html',
            'js': 'javascript',
            'mkd': 'markdown',
            'mkdown': 'markdown',
            'txt': 'markdown'
        };
        mode = typeof modes[mode] !== "undefined" ? modes[mode] : mode;
        if (mode.match(/^plain_text|css$/) && area.value.indexOf('</style>') !== -1) mode = 'html';
        if (mode.match(/^plain_text|javascript$/) && area.value.indexOf('</script>') !== -1) mode = 'html';
        editor = ace.edit(id); // init!
        editor.setTheme('ace/theme/' + ACE_CONFIG_THEME);
        editor.setShowFoldWidgets(ACE_CONFIG_STATE_SHOW_FOLD_WIDGET);
        editor.setHighlightActiveLine(ACE_CONFIG_STATE_HIGHLIGHT_ACTIVE_LINE);
        editor.getSession().setMode('ace/mode/' + mode);
        editor.getSession().setTabSize(ACE_CONFIG_TAB_SIZE);
        editor.getSession().setUseWrapMode(ACE_CONFIG_STATE_USE_WRAP_MODE);
        editor.getSession().setValue(area.value);
        editor.getSession().on('change', function() {
            area.value = editor.getSession().getValue();
            if (typeof Zepto === "function") {
                Zepto(area).trigger("keyup");
            } else if (typeof jQuery === "function") {
                jQuery(area).trigger("keyup");
            }
        });
        editor.setOption('selectionStyle', 'text'); // watch for unused white-space(s) before line break(s)
        editor.renderer.setShowInvisibles(ACE_CONFIG_STATE_SHOW_INVISIBLE);
        editor.renderer.setShowGutter(ACE_CONFIG_STATE_SHOW_GUTTER);
        editor.renderer.setDisplayIndentGuides(ACE_CONFIG_STATE_SHOW_INDENT_GUIDE);
    }
    function run() {
        for (var i in base.editors) {
            apply(d.getElementsByName(base.editors[i])[0], i);
        }
    }
    run(); // run!
    // handle hidden textarea(s)
    base.add('on_tab_show', run);
    base.add('on_modal_show', run);
    base.add('on_accordion_expand', run);
})(window, document, DASHBOARD);