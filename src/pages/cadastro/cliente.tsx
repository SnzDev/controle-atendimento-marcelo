

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Head from "next/head";
import Image from 'next/image';
import ListSubheader from '@mui/material/ListSubheader';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { useState } from 'react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

function Cliente() {

  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <Head>
        <title>Serviço</title>
        <meta name="description" content="cadastro de serviços" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <Image src="/Logo.png" width={95} height={95} alt="Logo AcesseNet" />
        <h1 className="text-stone-50 font-bold text-3xl"> AcesseNet</h1>
        <h3 className="text-stone-500 font-semibold text-lg">Cadastro de cliente</h3>
        <div className="w-full px-4 py-3">

          <List
            className=''
            sx={{ width: '100%', bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <ListItemButton onClick={handleClick}>
              <ListItemIcon>
              </ListItemIcon>
              <ListItemText primary="Cadastro de cliente" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <form className="flex flex-col justify-items-center">
                    <div>
                      <p className="text-stone-100 font-semibold text-base pt-8">Nome do cliente</p>
                      <span className="flex row items-center pl-1.5">
                        <Image src="/icons/User.svg" className="mr-[-32px] z-10" width={24} height={24} alt="Logo AcesseNet" />
                        <input
                          className="rounded p-2 pl-10 items-center my-2 w-80 text-stone-100 bg-stone-900"
                          type="text"
                          placeholder="Maria Cardoso Santos"
                        />
                      </span>
                    </div>
                    <div className="flex row justify-center">
                      <button className="p-2 mt-8 rounded w-80 font-semibold bg-blue-500 hover:bg-blue-300" >Cadastrar</button>
                    </div>
                  </form>
                </ListItemButton>
              </List>
            </Collapse>
          </List>
          <br />
          <div>
            <span className="flex row items-center pl-1.5">
              <Image src="/icons/Search.svg" className="mr-[-32px] z-10" width={24} height={24} alt="Logo AcesseNet" />
              <input
                className="rounded p-2 pl-10 items-center my-2 w-80 text-stone-100 bg-stone-900"
                type="text"
                placeholder="Pesquisa"
              />
            </span>
          </div>












          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Dessert (100g serving)</TableCell>
                  <TableCell align="right">Calories</TableCell>
                  <TableCell align="right">Fat&nbsp;(g)</TableCell>
                  <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                  <TableCell align="right">Protein&nbsp;(g)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </main>
    </>
  )
}

export default Cliente