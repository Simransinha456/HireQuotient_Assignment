import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import './Home.css';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem',backgroundColor: '#5e52f3',padding:"2px",borderRadius:"50%",color:"white" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function CustomizedAccordions() {
  const [data, setData] = React.useState([]);
  const [expanded, setExpanded] = React.useState(null);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://canopy-frontend-task.vercel.app/api/holdings');
        const json = await response.json();
        console.log(json);
        setData(json.payload);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const assetClassCounts = data.reduce((counts, item) => {
    counts[item.asset_class] = (counts[item.asset_class] || 0) + 1;
    return counts;
  }, {});

  return (
    <div>
      {Object?.entries(assetClassCounts).map(([assetClass, count], index) => (
        <Accordion key={index} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
          <AccordionSummary aria-controls={`panel${index}d-content`} id={`panel${index}d-header`}>
            <Typography>{`${assetClass} (${count})`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name of Holding</th>
                  <th>Ticker</th>
                  <th>Average Price</th>
                  <th>Market Price</th>
                  <th>Latest Change Percentage</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter((item) => item.asset_class === assetClass)
                  .map((item, idx) => (
                    <tr key={idx} className='rowValue'>
                      <td>{item.name}</td>
                      <td>{item.ticker}</td>
                      <td>{item.avg_price || ''}</td>
                      <td>{item.market_price || ''}</td>
                      <td>{item.latest_chg_pct || ''}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
