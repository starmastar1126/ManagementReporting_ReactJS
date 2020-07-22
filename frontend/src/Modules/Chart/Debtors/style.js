export const styles = theme => ({
  root: {

  },
  container: {
    height: '180px',
    position: 'relative'
  },
  fake: {
    position: 'absolute',
    background: 'transparent',
    width: '100%',
    height: '180px',
    '&:hover': {
      border: 'solid 2px #939393'
    }
  },
  item: {
    zIndex: 99
  }
});
