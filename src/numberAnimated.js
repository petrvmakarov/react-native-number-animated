// @flow

import React from 'react';
import {Animated, Text} from 'react-native';
import SharedAnimation from './sharedAnimation';
import type { ISharedAnimationDelegate } from './sharedAnimation';

type Props = {
  value: number | string,
  children: (number) => React.Component,
  duration?: number,
  nullValue: number | string,
};

type State = {
  animValue: Animated.Value
};

const DEFAULT_VALUE = 0;

export default class NumberAnimated extends React.Component<Props, State> implements ISharedAnimationDelegate {
  static defaultProps = {
    nullValue: '--',
  };

  state = {
    value: DEFAULT_VALUE,
    animValue: new Animated.Value(DEFAULT_VALUE),
  };

  prevValue = DEFAULT_VALUE;
  sharedAnimationId = null;

  onSharedAnimationFrame = ({value}) => {
    const {value: toValue} = this.props;
    let nextValue = Math.round(toValue * value);
    if (this.prevValue < toValue) {
      const add = toValue - this.prevValue;
      nextValue = this.prevValue + Math.round(add * value);
    } else if (this.prevValue > toValue) {
      const sub = this.prevValue - toValue;
      nextValue = this.prevValue - Math.round(sub * value);
    }
    this.setState({value: nextValue});
  }

  onSharedAnimationEnd = () => {
    const {value} = this.props;
    this.setState({value});
    SharedAnimation.removeListener(this);
  }

  componentDidMount = () => {
    this.animate();
  };

  componentWillUnmount = () => {
    SharedAnimation.removeListener(this);
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (prevProps.value !== this.props.value) {
      this.prevValue = prevProps.value;
      this.animate();
    }
  };

  animate = () => {
    SharedAnimation.addListener(this);
    SharedAnimation.start();
  };

  render = () => {
    const {children, nullValue} = this.props;
    const {value} = this.state;
    let uiValue = value;
    if (value === null || value === undefined) {
      uiValue = nullValue;
    }
    return children ? children(uiValue) : (<Text>{uiValue}</Text>);
  };
}
