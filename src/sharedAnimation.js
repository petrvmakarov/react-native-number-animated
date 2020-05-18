// @flow
import React from 'react';
import {Animated} from 'react-native';

export type AnimationId = string;

export interface ISharedAnimationDelegate {
  sharedAnimationId: AnimationId;
  onSharedAnimationFrame(value: any): void;
  onSharedAnimationEnd(): void;
}

const INSTANCE = Symbol('SharedAnimation-instance');

const animValue = new Animated.Value(0);
let isAnimationRunning = false;

const delegates = {};

class SharedAnimation {
  addListener(delegate: ISharedAnimationDelegate) {
    if (!delegate.sharedAnimationId || !delegates[delegate.sharedAnimationId]) {
      const animationId = animValue.addListener(delegate.onSharedAnimationFrame);
      delegate.sharedAnimationId = animationId;
      delegates[animationId] = delegate;
    }
  };

  removeListener(delegate: ISharedAnimationDelegate) {
    animValue.removeListener(delegate.sharedAnimationId);
    delete delegates[delegate.sharedAnimationId];
    delegate.sharedAnimationId = null;
  };

  onDidEnd = () => {
    Object.keys(delegates).forEach((k: string) => {
      const delegate: ISharedAnimationDelegate = delegates[k];
      try {
        delegate.onSharedAnimationEnd();
      } catch (e) {
        console.log(e);
      }
    });
    isAnimationRunning = false;
  };

  start = () => {
    if (isAnimationRunning) {
      return;
    }
    isAnimationRunning = true;
    animValue.setValue(0);
    Animated.timing(animValue, {
      toValue: 1,
      useNativeDriver: true,
      duration: 500,
    }).start(() => {
      this.onDidEnd();
    });
  };
}

function createInstance(): SharedAnimation {
  if (createInstance[INSTANCE]) {
    return createInstance[INSTANCE];
  }
  return createInstance[INSTANCE] = new SharedAnimation();
}

export default createInstance();
