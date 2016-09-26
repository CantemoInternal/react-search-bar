import 'es6-promise';
import classNames from 'classnames';
import React from 'react';
import Suggestions from './Suggestions'; //eslint-disable-line no-unused-vars

const keyCodes = {
  ENTER: 13,
  ESCAPE: 27,
  UP: 38,
  DOWN: 40
};

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    if (!props.onChange) {
      throw new Error('You must supply a callback to `onChange`.');
    }
    this.state = this.initialState = {
      highlightedItem: -1,
      searchTerm: '',
      suggestions: [],
      value: this.props.value || ''
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({value: nextProps.value});
    }  
  }
  componentDidMount() {
    if (this.props.autoFocus) {
      this.refs.input.focus();
    }
  }
  normalizeInput() {
    return this.state.value.trim();
  }
  autosuggest() {
    const searchTerm = this.normalizeInput();
    if (!searchTerm) return;
    new Promise((resolve) => {
      this.props.onChange(searchTerm, resolve);
    }).then((suggestions) => {
      if (!this.state.value) return;
      this.setState({
        highlightedItem: -1,
        searchTerm,
        suggestions
      });
    });
  }
  scroll(key) {
    const {highlightedItem: item, suggestions} = this.state;
    const lastItem = suggestions.length - 1;
    if (suggestions.length === 0) {
      return;
    }
    let nextItem;
    let value;
    if (key === keyCodes.UP) {
      nextItem = (item <= 0) ? lastItem : item - 1;
    } else {
      nextItem = (item === lastItem) ? 0 : item + 1;
    }
    value = suggestions[nextItem];

    if (item == 0 && lastItem == suggestions.length -1 && nextItem == suggestions.length - 1) {
      nextItem = -1;
      value = this.state.prevValue;
    }

    this.props.onChange(value, function(){});
    if (nextItem == 0 && item == -1) {
      this.setState({ prevValue: this.state.value });
    };
    if (nextItem == suggestions.length - 1 && lastItem == suggestions.length - 1 && item == -1) {
      this.setState({ prevValue: this.state.value });
    };
    this.setState({
      highlightedItem: nextItem,
      value: value
    });
  }
  search() {
    if (!this.state.value) return;
    const value = this.normalizeInput();
    clearTimeout(this.timer);
    this.refs.input.blur();
    const {highlightedItem, suggestions} = this.initialState;
    this.setState({highlightedItem, suggestions});
    if (this.props.onSearch) {
      this.props.onSearch(value);
    }
  }
  onChange(e) {
    clearTimeout(this.timer);
    const input = e.target.value;
    this.setState({value: input});
    this.timer = setTimeout(() => this.autosuggest(), this.props.delay);
  }
  onKeyDown(e) {
    const key = e.which || e.keyCode;
    switch (key) {
      case keyCodes.UP:
      case keyCodes.DOWN:
        e.preventDefault();
        this.scroll(key);
        break;

      case keyCodes.ENTER:
        if (this.state.suggestions.length > 0 && this.state.highlightedItem != -1) {
          e.preventDefault();
          this.setState({ suggestions: [] });
          this.props.onChange(this.state.value, function(){});
        }
        break;

      case keyCodes.ESCAPE:
        if (this.state.suggestions && this.state.prevValue) {
          this.setState({ suggestions: [], value: this.state.prevValue });
          this.props.onChange(this.state.prevValue, function(){});
        } else {
          this.setState({ suggestions: [] });
        }
        break;
    }
  }
  onSelection(suggestion) {
    this.setState({value: suggestion}, () => this.search());
  }
  onSearch(e) {
    //e.preventDefault();
    this.search();
  }
  render() {
    /*eslint-disable quotes*/
    return (
      <div className="search-bar-wrapper">
        <div className={classNames(
          'search-bar-field',
          {'is-focused': this.state.isFocused},
          {'has-suggestions': this.state.suggestions.length > 0}
        )}>
          <input
            className="search-bar-input"
            name={this.props.inputName}
            type="text"
            maxLength="100"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            ref="input"
            value={this.state.value}
            placeholder={this.props.placeholder}
            onChange={(e) => {
              this.setState({prevValue: e.target.value})
              this.onChange(e);
            }}
            onBlur={() => this.setState({isFocused: false, suggestions: []})}
            onKeyDown={this.state.suggestions && this.onKeyDown.bind(this)}
            onFocus={() => this.setState({isFocused: true})} />
            { this.state.value &&
              <span
                className="icon search-bar-clear"
                onClick={() => {
                  this.setState({ value: "" });
                  this.props.onChange("", function () {});
                }}>
                x
              </span> }
          <input
            className="icon search-bar-submit"
            type="submit"
            onClick={this.onSearch.bind(this)} />
        </div>
        { this.state.suggestions.length > 0 &&
          <Suggestions
            searchTerm={this.state.searchTerm}
            suggestions={this.state.suggestions}
            highlightedItem={this.state.highlightedItem}
            onSelection={this.onSelection.bind(this)} /> }
      </div>
    );
  }
  /*eslint-enable quotes*/
}

SearchBar.propTypes = {
  autoFocus: React.PropTypes.bool,
  delay: React.PropTypes.number,
  inputName: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  onSearch: React.PropTypes.func,
  placeholder: React.PropTypes.string
};

SearchBar.defaultProps = {
  autoFocus: true,
  delay: 200
};

export default SearchBar;
