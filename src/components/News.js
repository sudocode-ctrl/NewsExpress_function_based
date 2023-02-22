import React, { Component } from "react";
import PropTypes from "prop-types";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 9,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0
      
    }
    document.title = "NewsExpress - "+ (this.props.category).charAt(0).toUpperCase()+(this.props.category).slice(1) + " news";
  }

  async updateNews(){
    this.props.setProgress(20);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    this.props.setProgress(40);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    })
    this.props.setProgress(100);
  }
  
  async componentDidMount() {
    this.updateNews();
  }

  handlePrevClick = async () => {
    // let url = `https://newsapi.org/v2/top-headlines?country=${
    //   this.props.country
    // }&category=${
    //   this.props.category
    // }&apiKey=fe5ebba5d26f43e2b7b95e44c45426a1&page=${this.state.page -
    //   1}&pageSize=${this.props.pageSize}`;
    // this.setState({ loading: true });
    // let data = await fetch(url);
    // let parsedData = await data.json();

    // this.setState({
    //   page: this.state.page - 1,
    //   articles: parsedData.articles,
    //   loading: false,
    // });
    this.setState({page: this.state.page - 1})
    this.updateNews();
  };

  handleNextClick = async () => {
    // if (
    //   !(
    //     this.state.page + 1 >
    //     Math.ceil(this.state.totalResults / this.props.pageSize)
    //   )
    // ) {
    //   let url = `https://newsapi.org/v2/top-headlines?country=${
    //     this.props.country
    //   }&category=${
    //     this.props.category
    //   }&apiKey=fe5ebba5d26f43e2b7b95e44c45426a1&page=${this.state.page +
    //     1}&pageSize=${this.props.pageSize}`;
    //   this.setState({ loading: true });
    //   let data = await fetch(url);
    //   let parsedData = await data.json();

    //   this.setState({
    //     page: this.state.page + 1,
    //     articles: parsedData.articles,
    //     loading: false,
    //   });
    // }
    this.setState({page: this.state.page + 1})
    this.updateNews();
  };

  fetchMoreData = async () => {
    
      this.setState({page: this.state.page + 1});
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
      // this.setState({ loading: true });
      let data = await fetch(url);
      let parsedData = await data.json();
      this.setState({
        articles: this.state.articles.concat(parsedData.articles),
        totalResults: parsedData.totalResults
        
      })
      
      
   
  }; 

  render() {
    return (
      
      <>
        <h1 className="text-center my-5">NewsExpress - Top stories in {(this.props.category).charAt(0).toUpperCase()+(this.props.category).slice(1)} category</h1>
        {this.state.loading && <Spinner />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner/>}
        >

        <div className="container">

        <div className="row">
          {this.state.articles.map((element) => {
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
}
export default News;
