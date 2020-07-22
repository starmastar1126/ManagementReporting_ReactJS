import { barThinHeight } from "../../../../Assets/js/constant";

export const styles = theme => ({
  root: {
    height: '600px',
  },
  wrapper: {
    borderBottom: 'solid 1px #a9a9a9',
    '& p': {
      height: barThinHeight + 'px',
      margin: '0',
      padding: '0 3px',
      lineHeight: barThinHeight + 'px'
    }
  }
});
