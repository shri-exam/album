({
    block: 'b-page',
    title: 'Альбом',
    mix: [{ block: 'album', js: true }],
    favicon: '/favicon.ico',
    head: [
        { elem: 'css', url: '_index.css', ie: false },
        { elem: 'css', url: '_index', ie: true },
        { block: 'i-jquery', elem: 'core' },
        { elem: 'js', url: '_index.js' },
        { elem: 'js', url: 'jquery.mousewheel.min.js' },         
        { elem: 'meta', attrs: { name: 'description', content: '' }},
        { elem: 'meta', attrs: { name: 'keywords', content: '' }}
    ],
    content:[
        {   block: 'album',
            elem: 'loader',
            content: 'Loading...'            
        },
        {   block: 'album',
            elem: 'control',
            mods: { type: 'next' },          
        },
        {   block: 'album',
            elem: 'control',
            mods: { type: 'prev' },          
        },
        {
            block: 'wrap',
            content: [
                {
                    block: 'album-image-wrap',
                    content: [
                        {
                            block: 'album-image-list'
                        } 
                   ]  
                }
               
            ]
        }
    ]
})
