import {
  Route,
  Switch,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Price from "./Price";
import Chart from "./Chart";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinTickers } from "../api";

interface IParam {
  coinId: string;
}
interface ILocation {
  name: string;
}
interface ITag {
  coin_counter: number;
  ico_counter: number;
  id: string;
  name: string;
}
interface IinfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  tags: ITag[];
  team: object;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  links: object;
  links_extended: object;
  whitepaper: object;
  first_data_at: string;
  last_data_at: string;
}
interface IpriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

const Container = styled.div`
  padding: 0 20px;
  margin: 0 auto;
`;
const Header = styled.header`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 45px;
`;
const Loading = styled.h2`
  text-align: center;
  color: ${(props) => props.theme.textColor};
  font-size: 29px;
  margin-top: 60px;
`;
const Wrapper = styled.div`
  max-width: 450px;
  margin: 0 auto;
`;
const ItemDiv = styled.div``;
const TopP = styled.p`
  font-size: 12px;
  padding: 6px;
`;
const BottomP = styled.p`
  font-size: 18px;
  padding: 6px;
`;
const OverviewInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #212628;
  border-radius: 15px;
  ${ItemDiv} {
    padding: 7px;
    width: 33.3%;
    text-align: center;
  }
`;
const Descrip = styled.p`
  margin: 30px 0;
  font-weight: lighter;
  letter-spacing: 0.5px;
  line-height: 1.3;
`;
const OverviewSupp = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #212628;
  border-radius: 15px;
  ${ItemDiv} {
    padding: 7px 30px;
    text-align: center;
  }
`;
const Tabs = styled.div`
  margin: 20px auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Tab = styled.span<{ isActive: boolean }>`
  width: 49%;
  text-align: center;
  font-size: 14px;
  letter-spacing: 1.5px;
  a {
    display: block;
    padding: 10px 0;
    background-color: #191d1e;
    border-radius: 20px;
    transition: 0.2s ease-in;
    color: ${(props) =>
      props.isActive ? props.theme.accentColor : props.theme.textColor};
    &:hover {
      background-color: #0e1011;
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

function Coin() {
  const { coinId } = useParams<IParam>();
  const { state } = useLocation<ILocation>();
  const priceMatch = useRouteMatch("/:coinId/price");
  const chartMatch = useRouteMatch("/:coinId/chart");
  const { isLoading: infoLoading, data: infoData } = useQuery<IinfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId)
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<IpriceData>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId)
  );
    const loading = infoLoading || tickersLoading;
  /*
  const [loading, set_loading] = useState(true);
  const [info, set_info] = useState<IinfoData>();
  const [price, set_price] = useState<IpriceData>();

  useEffect(() => {
    (async () => {
      const infoData = await (
        await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
      ).json();
      const priceData = await (
        await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
      ).json();
      set_info(infoData);
      set_price(priceData);
      set_loading(false);
    })();
  }, [coinId]);
  */
  return (
    <Container>
      <Header>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </Title>
      </Header>
      {loading ? (
        <Loading>Loading...</Loading>
      ) : (
        <Wrapper>
          <OverviewInfo>
            <ItemDiv>
              <TopP>RANK:</TopP>
              <BottomP>{infoData?.rank || "No Data.."}</BottomP>
            </ItemDiv>
            <ItemDiv>
              <TopP>SYMBOL:</TopP>
              <BottomP>${infoData?.symbol || "No Data.."}</BottomP>
            </ItemDiv>
            <ItemDiv>
              <TopP>OPEN SOURCE:</TopP>
              <BottomP>{infoData?.open_source ? "YES" : "NO"}</BottomP>
            </ItemDiv>
          </OverviewInfo>
          <Descrip>{infoData?.description || "No Data.."}</Descrip>
          <OverviewSupp>
            <ItemDiv>
              <TopP>TOTAL SUPPLY:</TopP>
              <BottomP>{tickersData?.total_supply || 0}</BottomP>
            </ItemDiv>
            <ItemDiv>
              <TopP>MAX SUPPLY:</TopP>
              <BottomP>{tickersData?.max_supply || 0}</BottomP>
            </ItemDiv>
          </OverviewSupp>
          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>CHART</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>PRICE</Link>
            </Tab>
          </Tabs>
          <Switch>
            <Route path={`/:coidId/price`}>
              <Price />
            </Route>
            <Route path={`/:coidId/chart`}>
              <Chart />
            </Route>
          </Switch>
        </Wrapper>
      )}
    </Container>
  );
}

export default Coin;
