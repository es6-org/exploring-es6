$(document).ready(init);

function init() {
    marked.setOptions({
        highlight: function (code) {
            return hljs.highlightAuto(code).value;
        }
    });

    renderIndex();
    getContent(window.location.hash);
}

function renderIndex() {
    $.get('./index.md')
        .done(function (data) {
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

        $('.index a.current').removeClass('current');
        $(event.target).addClass('current');

        getContent(window.location.hash);
    });
}

function getContent(mdUrl) {
    if (!mdUrl) {
        return;
    }
    addLoadingLayer();
    $.get(mdUrl).done(function (data) {
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