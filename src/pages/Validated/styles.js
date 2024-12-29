export default {
    containerPrimary: {
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        width: '100%',
        height: '100%',
        background: '#fff',
        top: 0,
        left: 0,
        zIndex: 99,
        overflow: 'hidden',
        '& img': {
            height: '50%'
        },
        '& form': {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            alignItems: 'center',
            height: '50%',
            width: '100%',
            '> div.MuiGrid2-root': {
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
            },
            '.container-search-doc': {
                margin: '0 auto',
                maxWidth: '500px',
                '> p': {
                    textAlign: 'center',
                    fontSize: '20px'
                }
            }
        }
    }
}