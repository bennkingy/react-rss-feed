import * as React from 'react';
import styles from './RssFeed.module.scss';
import { IRssFeedProps } from './IRssFeedProps';
import { IRssFeedState } from './IRssFeedState';
import { escape } from '@microsoft/sp-lodash-subset';
import * as $ from "jquery";
import { string } from 'prop-types';

export default class RssFeed extends React.Component<IRssFeedProps, IRssFeedState> {

  constructor(props) {
    super(props);
    this.state = { news: [], url: this.props.description };
  }
  
  public componentDidMount() {
    this.getNews(this.state.url);
  }
  
  protected async getNews(url: string) {
    
    $.get(
      "https://cors-anywhere.herokuapp.com/" + url,
      function(data) {
        let $xml = $(data);
        let items = [];

        $xml.find("item").each(function() {
          let $this = $(this);
          items.push({
            title: $this.find("title").text(),
            link: $this.find("link").text()
            // link: $this.find("link").text(),
          });
        });

        this.setState({ news: items }, function() {
          // callback function to check what items going onto the array
          console.log(this.state.news);
        });
      }.bind(this),
      "xml"
    );
  }

  public render(): React.ReactElement<IRssFeedProps> {
    return (
      <div className={ styles.rssFeed }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Rss News Feed</span>
              {this.state.news.map(item => (
                <div className="panel" key={item.title}>
                  <h2 className="panel-title">
                    {item.title}
                  </h2>
                  <span>{item.link}</span>
                </div>
              ))}
            </div>
          </div>
          {/* <p className={ styles.description }>{escape(this.props.description)}</p>   */}
      </div>
    );
  }

}