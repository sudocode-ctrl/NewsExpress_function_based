import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import PropTypes from "prop-types";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  
  

  const updateNews = async ()=> {
    
    props.setProgress(20);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    let parsedData = await data.json();
    props.setProgress(40);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    
    props.setProgress(100);
  }
  
  useEffect(() => {
    document.title = "NewsExpress - "+ (props.category).charAt(0).toUpperCase()+(props.category).slice(1) + " news";
    updateNews();

  }, [])
  
  



 const fetchMoreData = async () => {
    
      setPage(page + 1);
      const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`;
      // this.setState({ loading: true });
      let data = await fetch(url);
      let parsedData = await data.json();
      setArticles(articles.concat(parsedData.articles));
      setTotalResults(parsedData.totalResults);
      
   
  }; 

 
    return (
      
      <>
        <h1 className="text-center " style={{margin: "35px 0px", marginTop:"90px"}}>NewsExpress - Top stories in {(props.category).charAt(0).toUpperCase()+(props.category).slice(1)} category</h1>
        {loading && <Spinner />}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner/>}
        >

        <div className="container">

        <div className="row">
          {articles.map((element) => {
              return <div className="col-md-4" key={element.url}>
                  <NewsItem title={element.title ? element.title : ""}
                    description={
                      element.description
                        ? element.description: ""
                    }
                    imageUrl={
                      element.urlToImage
                        ? element.urlToImage
                        : "https://img.freepik.com/free-vector/journalist-icon-flat_1284-4694.jpg?w=740&t=st=1676570806~exp=1676571406~hmac=8fe740174cadecb2439175bb7580f3b14254f12ba7a4cc089a8a518a00ce1491"
                    }
                    newsUrl={element.url}
                    author={element.author ? element.author : "Unknown author"}
                    date={
                      element.publishedAt ? element.publishedAt : "Unknown date"
                    }
                    source={element.source.name}
                  />
                </div>
            })}
          </div>
        </div>
        </InfiniteScroll>
        
      
      </>
    )
  
}

News.defaultProps = {
  country: "in",
  pageSize: 9,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
