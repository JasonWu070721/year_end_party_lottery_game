import { useState } from "react";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import fs from "fs";

const arrSize = 25;
let sleepCount = 200;
let randomCount = 20;
let slowCount = 20;
let isStopRandom = false;

function App() {
  const [itemStyle, setItemStyle] = useState(() => {
    return initArrData();
  });

  const [startButtonDisabled, setStartButtonDisabled] = useState(false);
  const [resetButtonDisabled, setResetButtonDisabled] = useState(false);
  const [stopButtonDisabled, setStopButtonDisabled] = useState(false);

  const [selected, setSelected] = useState<number[]>([]);
  const [unselected, setUnselected] = useState<number[]>(() => {
    return initUnselectedData();
  });
  async function sleepPromise(millisecond: number) {
    await new Promise((resolve) => setTimeout(resolve, millisecond));
  }

  function initArrData() {
    const arrData = Array.from(Array(arrSize)).map((_, index) => {
      return { index: index + 1, color: "#1A2027", backgroundColor: "#FAFAFA" };
    });

    return arrData;
  }

  function initUnselectedData() {
    let val = [];

    for (let i = 0; i < arrSize; i++) {
      val.push(i);
    }
    return val;
  }

  async function randomNum() {
    if (unselected.length <= 0) {
      return;
    }
    setStartButtonDisabled(true);

    let randomNum = 0;
    let _sleepCount = sleepCount;

    for (let i = 0; i < randomCount; i++) {
      let newItemStyle = [...itemStyle];
      if (isStopRandom) {
        setItemStyle(newItemStyle);

        isStopRandom = false;
        console.log("isStopRandom");

        return;
      }

      let randomIndex = Math.floor(Math.random() * unselected.length);

      randomNum = unselected[randomIndex];

      newItemStyle[randomNum] = {
        ...newItemStyle[randomNum],
        color: "#EB0000",
        backgroundColor: "#4545FF",
      };
      setItemStyle(newItemStyle);
      await sleepPromise(_sleepCount);
      _sleepCount = _sleepCount + slowCount;
    }

    // Remove unselect val
    let newNnselected = [...unselected];
    const index = newNnselected.indexOf(randomNum);
    if (index > -1) {
      newNnselected.splice(index, 1);
    }
    setUnselected(newNnselected);

    // push val to select
    let newSelected: number[] = [];
    if (selected.length !== 0) {
      newSelected = [...selected];
    }
    newSelected.push(randomNum);
    setSelected(newSelected);

    if (newNnselected.length > 0) {
      setStartButtonDisabled(false);
    }
  }

  async function resetNum() {
    isStopRandom = false;
    setResetButtonDisabled(true);
    const arrData = initArrData;
    setItemStyle(arrData);

    let newSelected: number[] = [];
    setSelected(newSelected);

    const unselectedData = initUnselectedData();
    setUnselected(unselectedData);

    setStartButtonDisabled(false);
    setResetButtonDisabled(false);
  }

  async function stopRandom() {
    console.log("stopRandom");
    setStopButtonDisabled(true);
    isStopRandom = true;
    setStartButtonDisabled(false);
    setStopButtonDisabled(false);
  }

  let selectedOne;

  if (selected.length > 0) {
    selectedOne = <div>{selected[selected.length - 1] + 1}</div>;
  } else {
    selectedOne = <div></div>;
  }

  let selectedOther;

  if (selected.length > 0) {
    selectedOther = () => {
      // console.log(selected.reverse());

      const selectedDelOne = [...selected];
      selectedDelOne.pop();
      const selectedReverse = selectedDelOne.slice(0).reverse();

      return (
        <div style={{ display: "inline-block" }}>
          {selectedReverse.map((number) => {
            return (
              <div style={{ display: "inline-block" }}>{number + 1} ,</div>
            );
          })}
        </div>
      );
    };
  } else {
    selectedOther = () => {
      return <div></div>;
    };
  }

  function DigitalCard() {
    return (
      <Grid
        container
        spacing={{ xs: 3, md: 3 }}
        columns={{ xs: 10, sm: 10, md: 10 }}
      >
        {itemStyle.map((val, index) => (
          <Grid xs={2} sm={2} md={2} key={index}>
            <Paper
              style={{
                width: "50px",
                height: "50px",
                color: val.color,
                backgroundColor: val.backgroundColor,
                textAlign: "center",

                lineHeight: "50px",
              }}
            >
              {val.index}
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  }

  function StartButton() {
    return (
      <Button
        variant="contained"
        onClick={() => {
          randomNum();
        }}
        disabled={startButtonDisabled}
      >
        START
      </Button>
    );
  }

  function ResetButton() {
    return (
      <Button
        variant="outlined"
        onClick={() => {
          resetNum();
        }}
        disabled={resetButtonDisabled}
      >
        RESET
      </Button>
    );
  }

  function StopButton() {
    return (
      <Button
        variant="outlined"
        onClick={() => {
          stopRandom();
        }}
        disabled={stopButtonDisabled}
      >
        STOP
      </Button>
    );
  }

  function createData(
    row1: number,
    row2: number,
    row3: number,
    row4: number,
    row5: number
  ) {
    return { row1, row2, row3, row4, row5 };
  }

  const rows = [
    createData(0, 6.0, 24, 4.0, 4.0),
    createData(237, 9.0, 37, 4.3, 4.0),
    createData(262, 16.0, 24, 6.0, 4.0),
    createData(305, 3.7, 67, 4.3, 4.0),
    createData(356, 16.0, 49, 3.9, 4.0),
  ];

  const Item = styled(Paper)(({}) => ({
    textAlign: "center",

    height: 60,
    lineHeight: "60px",
  }));

  function ListWinner() {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {rows.map((row) => (
              <TableRow>
                <TableCell
                  align="center"
                  style={{
                    height: 30,
                  }}
                >
                  {row.row1}
                </TableCell>
                <TableCell>{row.row2}</TableCell>
                <TableCell>{row.row3}</TableCell>
                <TableCell>{row.row4}</TableCell>
                <TableCell>{row.row5}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <Box
      sx={{ flexGrow: 1 }}
      style={{
        backgroundColor: "#BFBFBF",
      }}
    >
      <Grid container spacing={5}>
        <Grid xs={12} md={12}>
          <ResetButton />
          <StopButton />
        </Grid>

        <Grid xs={1} md={1}></Grid>
        <Grid xs={5} md={5}>
          <DigitalCard />
        </Grid>
        <Grid xs={5} md={5}>
          <ListWinner />
        </Grid>
        <Grid xs={1} md={1}></Grid>

        <Grid xs={1} md={1}></Grid>
        <Grid xs={5} md={5}>
          <StartButton />
        </Grid>
        <Grid xs={5} md={5}>
          <Box>{selectedOne}</Box>
        </Grid>
        <Grid xs={1} md={1}></Grid>

        <Grid xs={1} md={1}></Grid>
        <Grid xs={5} md={5}>
          <Box sx={{ p: 1, my: 1, border: "1px solid" }}>{selectedOther()}</Box>
        </Grid>
        <Grid xs={5} md={5}></Grid>
        <Grid xs={1} md={1}></Grid>

        <Grid xs={1} md={1}></Grid>
        <Grid xs={10} md={10}></Grid>
        <Grid xs={1} md={1}></Grid>
      </Grid>
    </Box>
  );
}

export default App;
