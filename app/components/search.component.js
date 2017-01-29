import React from 'react';
import Autocomplete from 'react-autocomplete';

class Search extends React.Component{
    handleRenderItem(item, isHighlighted) {
        const listStyle = {
            item: {
                padding: '2px 6px',
                cursor: 'default'
            },

            highlightedItem: {
                color: 'white',
                background: '#F38B72',
                padding: '2px 6px',
                cursor: 'default'
            }
        };

        return (
            <div 
                style={isHighlighted ? listStyle.highlightedItem : listStyle.item}
                key={item.id}
                id={item.id}
            >
                {item.title}
            </div>
        )
    }

    render () {
        return (
            <div className="search">
                <input
                    type='text'  
                    value={this.props.searchValue}
                    onChange={this.props.handleChange}
                    onBlur={this.props.handleBlur}
                    placeholder={this.props.placeholder}
                />
                <div className="after"></div>
                <i className={`fa ${this.props.preloader ? 'fa-spinner' : 'fa-search'}`}/>
            </div>
        );
    }
}

export default Search
