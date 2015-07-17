$(document).ready(init);

function init() {
    marked.setOptions({
        highlight: function (code) {
            return hljs.highlightAuto(code).value;
        }
    });

    renderIndex().then(function () {
        toIndex(window.location.hash, true);
    });
}

function renderIndex() {
    return $.ajax({
        url: './md/index.md',
        async: true
    }).then(function (data) {
        marked(data, function (err, content) {
            $('.index').html(content);
            bindIndexEvents();
        });
    });
}

function bindIndexEvents() {
    $('.index a').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        window.location.hash = $(event.target).attr('href');
        toIndex(window.location.hash);
    });
}

function toIndex(hash, isInit) {
    hash = hash.replace(/^#/, '');
    var $curLink = $('.index a[href="' + hash + '"]');
    if (!$curLink.length) {
        return;
    }

    $('.index a.current').removeClass('current');
    $curLink.addClass('current');

    if ($curLink[0].scrollIntoView && isInit) {
        $curLink[0].scrollIntoView();
    }

    getContent(hash);
}

function getContent(mdUrl) {
    if (!mdUrl) {
        return;
    }
    addLoadingLayer();
    $.ajax({
        url: './md/' + mdUrl.replace(/^\.\//, ''),
        async: true
    }).done(function (data) {
        marked(data, function (err, content) {
            $('.content').html(content);
            removeLayer();
        });
    });
}

function addLoadingLayer() {
    if (addLoadingLayer.$layer) {
        return;
    }
    var $layer = $([
        '<div class="layer">',
            '<div class="cover"></div>',
            '<div class="tip">加载中...</div>',
        '</div>'
    ].join(''));
    $('body').append($layer);
    addLoadingLayer.$layer = $layer;
}

function removeLayer() {
    if (addLoadingLayer.$layer) {
        addLoadingLayer.$layer.remove();
        addLoadingLayer.$layer = undefined;
    }
}