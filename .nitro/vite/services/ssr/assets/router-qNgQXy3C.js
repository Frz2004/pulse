import { X as reactExports, J as isPromise, K as isRedirect, I as isNotFound, E as invariant, h as createControlledPromise, a4 as rootRouteId, L as isServer$1, w as functionalUpdate$1, b as arraysEqual, i as createLRUCache, f as compileDecodeCharMap, a6 as trimPath, a3 as rewriteBasepath, g as composeRewrites, W as processRouteTree, V as processRouteMasks, a2 as resolvePath, d as cleanPath, a8 as trimPathRight, U as parseHref, r as executeRewriteInput, F as isDangerousProtocol, Y as redirect, v as findSingleMatch, m as deepEqual, D as DEFAULT_PROTOCOL_ALLOWLIST, c as buildRouteBranch, C as interpolatePath, S as nullReplaceEqualDeep, _ as replaceEqualDeep$1, P as last, l as decodePath, t as findFlatMatch, u as findRouteMatch, B as hasKeys, s as executeRewriteOutput, o as encodePathLikeUrl, a7 as trimPathLeft, M as joinPaths, aa as useRouter, n as dummyMatchContext, Q as matchContext, y as getDefaultExportFromCjs, a0 as requireReactDom, q as exactPathTest, Z as removeTrailingSlash, R as React, N as jsxRuntimeExports, H as isModuleNotFoundError, a9 as useHydrated, p as escapeHtml, G as isInlinableStylesheet, x as getAssetCrossOrigin, a1 as resolveManifestAssetLink, O as Outlet } from "./server-ChSCHK5Z.js";
import { s as supabase } from "./client-C8UrIk37.js";
import { o as objectType, c as coerce } from "./types-DNG0tEns.js";
var reactUse = reactExports.use;
function useForwardedRef(ref) {
  const innerRef = reactExports.useRef(null);
  reactExports.useImperativeHandle(ref, () => innerRef.current, []);
  return innerRef;
}
function encode(obj, stringify = String) {
  const result = new URLSearchParams();
  for (const key in obj) {
    const val = obj[key];
    if (val !== void 0) result.set(key, stringify(val));
  }
  return result.toString();
}
function toValue(str) {
  if (!str) return "";
  if (str === "false") return false;
  if (str === "true") return true;
  return +str * 0 === 0 && +str + "" === str ? +str : str;
}
function decode(str) {
  const searchParams = new URLSearchParams(str);
  const result = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of searchParams.entries()) {
    const previousValue = result[key];
    if (previousValue == null) result[key] = toValue(value);
    else if (Array.isArray(previousValue)) previousValue.push(toValue(value));
    else result[key] = [previousValue, toValue(value)];
  }
  return result;
}
const defaultParseSearch = parseSearchWith(JSON.parse);
const defaultStringifySearch = stringifySearchWith(JSON.stringify, JSON.parse);
function parseSearchWith(parser) {
  return (searchStr) => {
    if (searchStr[0] === "?") searchStr = searchStr.substring(1);
    const query = decode(searchStr);
    for (const key in query) {
      const value = query[key];
      if (typeof value === "string") try {
        query[key] = parser(value);
      } catch (_err) {
      }
    }
    return query;
  };
}
function stringifySearchWith(stringify, parser) {
  const hasParser = typeof parser === "function";
  function stringifyValue(val) {
    if (typeof val === "object" && val !== null) try {
      return stringify(val);
    } catch (_err) {
    }
    else if (hasParser && typeof val === "string") try {
      parser(val);
      return stringify(val);
    } catch (_err) {
    }
    return val;
  }
  return (search) => {
    const searchStr = encode(search, stringifyValue);
    return searchStr ? `?${searchStr}` : "";
  };
}
const triggerOnReady = (inner) => {
  if (!inner.rendered) {
    inner.rendered = true;
    return inner.onReady?.();
  }
};
const resolvePreload = (inner, matchId) => {
  return !!(inner.preload && !inner.router.stores.matchStores.has(matchId));
};
const buildMatchContext = (inner, index, includeCurrentMatch = true) => {
  const context = { ...inner.router.options.context ?? {} };
  const end = includeCurrentMatch ? index : index - 1;
  for (let i2 = 0; i2 <= end; i2++) {
    const innerMatch = inner.matches[i2];
    if (!innerMatch) continue;
    const m2 = inner.router.getMatch(innerMatch.id);
    if (!m2) continue;
    Object.assign(context, m2.__routeContext, m2.__beforeLoadContext);
  }
  return context;
};
const getNotFoundBoundaryIndex = (inner, err) => {
  if (!inner.matches.length) return;
  const requestedRouteId = err.routeId;
  const matchedRootIndex = inner.matches.findIndex((m2) => m2.routeId === inner.router.routeTree.id);
  const rootIndex = matchedRootIndex >= 0 ? matchedRootIndex : 0;
  let startIndex = requestedRouteId ? inner.matches.findIndex((match) => match.routeId === requestedRouteId) : inner.firstBadMatchIndex ?? inner.matches.length - 1;
  if (startIndex < 0) startIndex = rootIndex;
  for (let i2 = startIndex; i2 >= 0; i2--) {
    const match = inner.matches[i2];
    if (inner.router.looseRoutesById[match.routeId].options.notFoundComponent) return i2;
  }
  return requestedRouteId ? startIndex : rootIndex;
};
const handleRedirectAndNotFound = (inner, match, err) => {
  if (!isRedirect(err) && !isNotFound(err)) return;
  if (isRedirect(err) && err.redirectHandled && !err.options.reloadDocument) throw err;
  if (match) {
    match._nonReactive.beforeLoadPromise?.resolve();
    match._nonReactive.loaderPromise?.resolve();
    match._nonReactive.beforeLoadPromise = void 0;
    match._nonReactive.loaderPromise = void 0;
    match._nonReactive.error = err;
    inner.updateMatch(match.id, (prev) => ({
      ...prev,
      status: isRedirect(err) ? "redirected" : isNotFound(err) ? "notFound" : prev.status === "pending" ? "success" : prev.status,
      context: buildMatchContext(inner, match.index),
      isFetching: false,
      error: err
    }));
    if (isNotFound(err) && !err.routeId) err.routeId = match.routeId;
    match._nonReactive.loadPromise?.resolve();
  }
  if (isRedirect(err)) {
    inner.rendered = true;
    err.options._fromLocation = inner.location;
    err.redirectHandled = true;
    err = inner.router.resolveRedirect(err);
  }
  throw err;
};
const shouldSkipLoader = (inner, matchId) => {
  const match = inner.router.getMatch(matchId);
  if (!match) return true;
  if (match.ssr === false) return true;
  return false;
};
const syncMatchContext = (inner, matchId, index) => {
  const nextContext = buildMatchContext(inner, index);
  inner.updateMatch(matchId, (prev) => {
    return {
      ...prev,
      context: nextContext
    };
  });
};
const handleSerialError = (inner, index, err, routerCode) => {
  const { id: matchId, routeId } = inner.matches[index];
  const route = inner.router.looseRoutesById[routeId];
  if (err instanceof Promise) throw err;
  err.routerCode = routerCode;
  inner.firstBadMatchIndex ??= index;
  handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), err);
  try {
    route.options.onError?.(err);
  } catch (errorHandlerErr) {
    err = errorHandlerErr;
    handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), err);
  }
  inner.updateMatch(matchId, (prev) => {
    prev._nonReactive.beforeLoadPromise?.resolve();
    prev._nonReactive.beforeLoadPromise = void 0;
    prev._nonReactive.loadPromise?.resolve();
    return {
      ...prev,
      error: err,
      status: "error",
      isFetching: false,
      updatedAt: Date.now(),
      abortController: new AbortController()
    };
  });
  if (!inner.preload && !isRedirect(err) && !isNotFound(err)) inner.serialError ??= err;
};
const isBeforeLoadSsr = (inner, matchId, index, route) => {
  const existingMatch = inner.router.getMatch(matchId);
  const parentMatchId = inner.matches[index - 1]?.id;
  const parentMatch = parentMatchId ? inner.router.getMatch(parentMatchId) : void 0;
  if (inner.router.isShell()) {
    existingMatch.ssr = route.id === rootRouteId;
    return;
  }
  if (parentMatch?.ssr === false) {
    existingMatch.ssr = false;
    return;
  }
  const parentOverride = (tempSsr2) => {
    if (tempSsr2 === true && parentMatch?.ssr === "data-only") return "data-only";
    return tempSsr2;
  };
  const defaultSsr = inner.router.options.defaultSsr ?? true;
  if (route.options.ssr === void 0) {
    existingMatch.ssr = parentOverride(defaultSsr);
    return;
  }
  if (typeof route.options.ssr !== "function") {
    existingMatch.ssr = parentOverride(route.options.ssr);
    return;
  }
  const { search, params } = existingMatch;
  const ssrFnContext = {
    search: makeMaybe(search, existingMatch.searchError),
    params: makeMaybe(params, existingMatch.paramsError),
    location: inner.location,
    matches: inner.matches.map((match) => ({
      index: match.index,
      pathname: match.pathname,
      fullPath: match.fullPath,
      staticData: match.staticData,
      id: match.id,
      routeId: match.routeId,
      search: makeMaybe(match.search, match.searchError),
      params: makeMaybe(match.params, match.paramsError),
      ssr: match.ssr
    }))
  };
  const tempSsr = route.options.ssr(ssrFnContext);
  if (isPromise(tempSsr)) return tempSsr.then((ssr) => {
    existingMatch.ssr = parentOverride(ssr ?? defaultSsr);
  });
  existingMatch.ssr = parentOverride(tempSsr ?? defaultSsr);
};
const setupPendingTimeout = (inner, matchId, route, match) => {
  if (match._nonReactive.pendingTimeout !== void 0) return;
  const pendingMs = route.options.pendingMs ?? inner.router.options.defaultPendingMs;
  if (!!(inner.onReady && false)) {
    const pendingTimeout = setTimeout(() => {
      triggerOnReady(inner);
    }, pendingMs);
    match._nonReactive.pendingTimeout = pendingTimeout;
  }
};
const preBeforeLoadSetup = (inner, matchId, route) => {
  const existingMatch = inner.router.getMatch(matchId);
  if (!existingMatch._nonReactive.beforeLoadPromise && !existingMatch._nonReactive.loaderPromise) return;
  setupPendingTimeout(inner, matchId, route, existingMatch);
  const then = () => {
    const match = inner.router.getMatch(matchId);
    if (match.preload && (match.status === "redirected" || match.status === "notFound")) handleRedirectAndNotFound(inner, match, match.error);
  };
  return existingMatch._nonReactive.beforeLoadPromise ? existingMatch._nonReactive.beforeLoadPromise.then(then) : then();
};
const executeBeforeLoad = (inner, matchId, index, route) => {
  const match = inner.router.getMatch(matchId);
  let prevLoadPromise = match._nonReactive.loadPromise;
  match._nonReactive.loadPromise = createControlledPromise(() => {
    prevLoadPromise?.resolve();
    prevLoadPromise = void 0;
  });
  const { paramsError, searchError } = match;
  if (paramsError) handleSerialError(inner, index, paramsError, "PARSE_PARAMS");
  if (searchError) handleSerialError(inner, index, searchError, "VALIDATE_SEARCH");
  setupPendingTimeout(inner, matchId, route, match);
  const abortController = new AbortController();
  let isPending = false;
  const pending = () => {
    if (isPending) return;
    isPending = true;
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      isFetching: "beforeLoad",
      fetchCount: prev.fetchCount + 1,
      abortController
    }));
  };
  const resolve = () => {
    match._nonReactive.beforeLoadPromise?.resolve();
    match._nonReactive.beforeLoadPromise = void 0;
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      isFetching: false
    }));
  };
  if (!route.options.beforeLoad) {
    inner.router.batch(() => {
      pending();
      resolve();
    });
    return;
  }
  match._nonReactive.beforeLoadPromise = createControlledPromise();
  const context = {
    ...buildMatchContext(inner, index, false),
    ...match.__routeContext
  };
  const { search, params, cause } = match;
  const preload = resolvePreload(inner, matchId);
  const beforeLoadFnContext = {
    search,
    abortController,
    params,
    preload,
    context,
    location: inner.location,
    navigate: (opts) => inner.router.navigate({
      ...opts,
      _fromLocation: inner.location
    }),
    buildLocation: inner.router.buildLocation,
    cause: preload ? "preload" : cause,
    matches: inner.matches,
    routeId: route.id,
    ...inner.router.options.additionalContext
  };
  const updateContext = (beforeLoadContext2) => {
    if (beforeLoadContext2 === void 0) {
      inner.router.batch(() => {
        pending();
        resolve();
      });
      return;
    }
    if (isRedirect(beforeLoadContext2) || isNotFound(beforeLoadContext2)) {
      pending();
      handleSerialError(inner, index, beforeLoadContext2, "BEFORE_LOAD");
    }
    inner.router.batch(() => {
      pending();
      inner.updateMatch(matchId, (prev) => ({
        ...prev,
        __beforeLoadContext: beforeLoadContext2
      }));
      resolve();
    });
  };
  let beforeLoadContext;
  try {
    beforeLoadContext = route.options.beforeLoad(beforeLoadFnContext);
    if (isPromise(beforeLoadContext)) {
      pending();
      return beforeLoadContext.catch((err) => {
        handleSerialError(inner, index, err, "BEFORE_LOAD");
      }).then(updateContext);
    }
  } catch (err) {
    pending();
    handleSerialError(inner, index, err, "BEFORE_LOAD");
  }
  updateContext(beforeLoadContext);
};
const handleBeforeLoad = (inner, index) => {
  const { id: matchId, routeId } = inner.matches[index];
  const route = inner.router.looseRoutesById[routeId];
  const serverSsr = () => {
    {
      const maybePromise = isBeforeLoadSsr(inner, matchId, index, route);
      if (isPromise(maybePromise)) return maybePromise.then(queueExecution);
    }
    return queueExecution();
  };
  const execute = () => executeBeforeLoad(inner, matchId, index, route);
  const queueExecution = () => {
    if (shouldSkipLoader(inner, matchId)) return;
    const result = preBeforeLoadSetup(inner, matchId, route);
    return isPromise(result) ? result.then(execute) : execute();
  };
  return serverSsr();
};
const executeHead = (inner, matchId, route) => {
  const match = inner.router.getMatch(matchId);
  if (!match) return;
  if (!route.options.head && !route.options.scripts && !route.options.headers) return;
  const assetContext = {
    ssr: inner.router.options.ssr,
    matches: inner.matches,
    match,
    params: match.params,
    loaderData: match.loaderData
  };
  return Promise.all([
    route.options.head?.(assetContext),
    route.options.scripts?.(assetContext),
    route.options.headers?.(assetContext)
  ]).then(([headFnContent, scripts, headers]) => {
    return {
      meta: headFnContent?.meta,
      links: headFnContent?.links,
      headScripts: headFnContent?.scripts,
      headers,
      scripts,
      styles: headFnContent?.styles
    };
  });
};
const getLoaderContext = (inner, matchPromises, matchId, index, route) => {
  const parentMatchPromise = matchPromises[index - 1];
  const { params, loaderDeps, abortController, cause } = inner.router.getMatch(matchId);
  const context = buildMatchContext(inner, index);
  const preload = resolvePreload(inner, matchId);
  return {
    params,
    deps: loaderDeps,
    preload: !!preload,
    parentMatchPromise,
    abortController,
    context,
    location: inner.location,
    navigate: (opts) => inner.router.navigate({
      ...opts,
      _fromLocation: inner.location
    }),
    cause: preload ? "preload" : cause,
    route,
    ...inner.router.options.additionalContext
  };
};
const runLoader = async (inner, matchPromises, matchId, index, route) => {
  try {
    const match = inner.router.getMatch(matchId);
    try {
      if (!(isServer$1 ?? inner.router.isServer) || match.ssr === true) loadRouteChunk(route);
      const routeLoader = route.options.loader;
      const loader = typeof routeLoader === "function" ? routeLoader : routeLoader?.handler;
      const loaderResult = loader?.(getLoaderContext(inner, matchPromises, matchId, index, route));
      const loaderResultIsPromise = !!loader && isPromise(loaderResult);
      if (!!(loaderResultIsPromise || route._lazyPromise || route._componentsPromise || route.options.head || route.options.scripts || route.options.headers || match._nonReactive.minPendingPromise)) inner.updateMatch(matchId, (prev) => ({
        ...prev,
        isFetching: "loader"
      }));
      if (loader) {
        const loaderData = loaderResultIsPromise ? await loaderResult : loaderResult;
        handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), loaderData);
        if (loaderData !== void 0) inner.updateMatch(matchId, (prev) => ({
          ...prev,
          loaderData
        }));
      }
      if (route._lazyPromise) await route._lazyPromise;
      const pendingPromise = match._nonReactive.minPendingPromise;
      if (pendingPromise) await pendingPromise;
      if (route._componentsPromise) await route._componentsPromise;
      inner.updateMatch(matchId, (prev) => ({
        ...prev,
        error: void 0,
        context: buildMatchContext(inner, index),
        status: "success",
        isFetching: false,
        updatedAt: Date.now()
      }));
    } catch (e2) {
      let error = e2;
      if (error?.name === "AbortError") {
        if (match.abortController.signal.aborted) {
          match._nonReactive.loaderPromise?.resolve();
          match._nonReactive.loaderPromise = void 0;
          return;
        }
        inner.updateMatch(matchId, (prev) => ({
          ...prev,
          status: prev.status === "pending" ? "success" : prev.status,
          isFetching: false,
          context: buildMatchContext(inner, index)
        }));
        return;
      }
      const pendingPromise = match._nonReactive.minPendingPromise;
      if (pendingPromise) await pendingPromise;
      if (isNotFound(e2)) await route.options.notFoundComponent?.preload?.();
      handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), e2);
      try {
        route.options.onError?.(e2);
      } catch (onErrorError) {
        error = onErrorError;
        handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), onErrorError);
      }
      if (!isRedirect(error) && !isNotFound(error)) await loadRouteChunk(route, ["errorComponent"]);
      inner.updateMatch(matchId, (prev) => ({
        ...prev,
        error,
        context: buildMatchContext(inner, index),
        status: "error",
        isFetching: false
      }));
    }
  } catch (err) {
    const match = inner.router.getMatch(matchId);
    if (match) match._nonReactive.loaderPromise = void 0;
    handleRedirectAndNotFound(inner, match, err);
  }
};
const loadRouteMatch = async (inner, matchPromises, index) => {
  async function handleLoader(preload, prevMatch, previousRouteMatchId, match2, route2) {
    const age = Date.now() - prevMatch.updatedAt;
    const staleAge = preload ? route2.options.preloadStaleTime ?? inner.router.options.defaultPreloadStaleTime ?? 3e4 : route2.options.staleTime ?? inner.router.options.defaultStaleTime ?? 0;
    const shouldReloadOption = route2.options.shouldReload;
    const shouldReload = typeof shouldReloadOption === "function" ? shouldReloadOption(getLoaderContext(inner, matchPromises, matchId, index, route2)) : shouldReloadOption;
    const { status, invalid } = match2;
    const staleMatchShouldReload = age >= staleAge && (!!inner.forceStaleReload || match2.cause === "enter" || previousRouteMatchId !== void 0 && previousRouteMatchId !== match2.id);
    loaderShouldRunAsync = status === "success" && (invalid || (shouldReload ?? staleMatchShouldReload));
    if (preload && route2.options.preload === false) ;
    else if (loaderShouldRunAsync && !inner.sync && shouldReloadInBackground) {
      loaderIsRunningAsync = true;
      (async () => {
        try {
          await runLoader(inner, matchPromises, matchId, index, route2);
          const match3 = inner.router.getMatch(matchId);
          match3._nonReactive.loaderPromise?.resolve();
          match3._nonReactive.loadPromise?.resolve();
          match3._nonReactive.loaderPromise = void 0;
          match3._nonReactive.loadPromise = void 0;
        } catch (err) {
          if (isRedirect(err)) await inner.router.navigate(err.options);
        }
      })();
    } else if (status !== "success" || loaderShouldRunAsync) await runLoader(inner, matchPromises, matchId, index, route2);
    else syncMatchContext(inner, matchId, index);
  }
  const { id: matchId, routeId } = inner.matches[index];
  let loaderShouldRunAsync = false;
  let loaderIsRunningAsync = false;
  const route = inner.router.looseRoutesById[routeId];
  const routeLoader = route.options.loader;
  const shouldReloadInBackground = ((typeof routeLoader === "function" ? void 0 : routeLoader?.staleReloadMode) ?? inner.router.options.defaultStaleReloadMode) !== "blocking";
  if (shouldSkipLoader(inner, matchId)) {
    if (!inner.router.getMatch(matchId)) return inner.matches[index];
    syncMatchContext(inner, matchId, index);
    return inner.router.getMatch(matchId);
  } else {
    const prevMatch = inner.router.getMatch(matchId);
    const activeIdAtIndex = inner.router.stores.matchesId.get()[index];
    const previousRouteMatchId = (activeIdAtIndex && inner.router.stores.matchStores.get(activeIdAtIndex) || null)?.routeId === routeId ? activeIdAtIndex : inner.router.stores.matches.get().find((d2) => d2.routeId === routeId)?.id;
    const preload = resolvePreload(inner, matchId);
    if (prevMatch._nonReactive.loaderPromise) {
      if (prevMatch.status === "success" && !inner.sync && !prevMatch.preload && shouldReloadInBackground) return prevMatch;
      await prevMatch._nonReactive.loaderPromise;
      const match2 = inner.router.getMatch(matchId);
      const error = match2._nonReactive.error || match2.error;
      if (error) handleRedirectAndNotFound(inner, match2, error);
      if (match2.status === "pending") await handleLoader(preload, prevMatch, previousRouteMatchId, match2, route);
    } else {
      const nextPreload = preload && !inner.router.stores.matchStores.has(matchId);
      const match2 = inner.router.getMatch(matchId);
      match2._nonReactive.loaderPromise = createControlledPromise();
      if (nextPreload !== match2.preload) inner.updateMatch(matchId, (prev) => ({
        ...prev,
        preload: nextPreload
      }));
      await handleLoader(preload, prevMatch, previousRouteMatchId, match2, route);
    }
  }
  const match = inner.router.getMatch(matchId);
  if (!loaderIsRunningAsync) {
    match._nonReactive.loaderPromise?.resolve();
    match._nonReactive.loadPromise?.resolve();
    match._nonReactive.loadPromise = void 0;
  }
  clearTimeout(match._nonReactive.pendingTimeout);
  match._nonReactive.pendingTimeout = void 0;
  if (!loaderIsRunningAsync) match._nonReactive.loaderPromise = void 0;
  match._nonReactive.dehydrated = void 0;
  const nextIsFetching = loaderIsRunningAsync ? match.isFetching : false;
  if (nextIsFetching !== match.isFetching || match.invalid !== false) {
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      isFetching: nextIsFetching,
      invalid: false
    }));
    return inner.router.getMatch(matchId);
  } else return match;
};
async function loadMatches(arg) {
  const inner = arg;
  const matchPromises = [];
  let beforeLoadNotFound;
  for (let i2 = 0; i2 < inner.matches.length; i2++) {
    try {
      const beforeLoad = handleBeforeLoad(inner, i2);
      if (isPromise(beforeLoad)) await beforeLoad;
    } catch (err) {
      if (isRedirect(err)) throw err;
      if (isNotFound(err)) beforeLoadNotFound = err;
      else if (!inner.preload) throw err;
      break;
    }
    if (inner.serialError || inner.firstBadMatchIndex != null) break;
  }
  const baseMaxIndexExclusive = inner.firstBadMatchIndex ?? inner.matches.length;
  const boundaryIndex = beforeLoadNotFound && !inner.preload ? getNotFoundBoundaryIndex(inner, beforeLoadNotFound) : void 0;
  const maxIndexExclusive = beforeLoadNotFound && inner.preload ? 0 : boundaryIndex !== void 0 ? Math.min(boundaryIndex + 1, baseMaxIndexExclusive) : baseMaxIndexExclusive;
  let firstNotFound;
  let firstUnhandledRejection;
  for (let i2 = 0; i2 < maxIndexExclusive; i2++) matchPromises.push(loadRouteMatch(inner, matchPromises, i2));
  try {
    await Promise.all(matchPromises);
  } catch {
    const settled = await Promise.allSettled(matchPromises);
    for (const result of settled) {
      if (result.status !== "rejected") continue;
      const reason = result.reason;
      if (isRedirect(reason)) throw reason;
      if (isNotFound(reason)) firstNotFound ??= reason;
      else firstUnhandledRejection ??= reason;
    }
    if (firstUnhandledRejection !== void 0) throw firstUnhandledRejection;
  }
  const notFoundToThrow = firstNotFound ?? (beforeLoadNotFound && !inner.preload ? beforeLoadNotFound : void 0);
  let headMaxIndex = inner.firstBadMatchIndex !== void 0 ? inner.firstBadMatchIndex : inner.matches.length - 1;
  if (!notFoundToThrow && beforeLoadNotFound && inner.preload) return inner.matches;
  if (notFoundToThrow) {
    const renderedBoundaryIndex = getNotFoundBoundaryIndex(inner, notFoundToThrow);
    if (renderedBoundaryIndex === void 0) {
      invariant();
    }
    const boundaryMatch = inner.matches[renderedBoundaryIndex];
    const boundaryRoute = inner.router.looseRoutesById[boundaryMatch.routeId];
    const defaultNotFoundComponent = inner.router.options?.defaultNotFoundComponent;
    if (!boundaryRoute.options.notFoundComponent && defaultNotFoundComponent) boundaryRoute.options.notFoundComponent = defaultNotFoundComponent;
    notFoundToThrow.routeId = boundaryMatch.routeId;
    const boundaryIsRoot = boundaryMatch.routeId === inner.router.routeTree.id;
    inner.updateMatch(boundaryMatch.id, (prev) => ({
      ...prev,
      ...boundaryIsRoot ? {
        status: "success",
        globalNotFound: true,
        error: void 0
      } : {
        status: "notFound",
        error: notFoundToThrow
      },
      isFetching: false
    }));
    headMaxIndex = renderedBoundaryIndex;
    await loadRouteChunk(boundaryRoute, ["notFoundComponent"]);
  } else if (!inner.preload) {
    const rootMatch = inner.matches[0];
    if (!rootMatch.globalNotFound) {
      if (inner.router.getMatch(rootMatch.id)?.globalNotFound) inner.updateMatch(rootMatch.id, (prev) => ({
        ...prev,
        globalNotFound: false,
        error: void 0
      }));
    }
  }
  if (inner.serialError && inner.firstBadMatchIndex !== void 0) {
    const errorRoute = inner.router.looseRoutesById[inner.matches[inner.firstBadMatchIndex].routeId];
    await loadRouteChunk(errorRoute, ["errorComponent"]);
  }
  for (let i2 = 0; i2 <= headMaxIndex; i2++) {
    const { id: matchId, routeId } = inner.matches[i2];
    const route = inner.router.looseRoutesById[routeId];
    try {
      const headResult = executeHead(inner, matchId, route);
      if (headResult) {
        const head = await headResult;
        inner.updateMatch(matchId, (prev) => ({
          ...prev,
          ...head
        }));
      }
    } catch (err) {
      console.error(`Error executing head for route ${routeId}:`, err);
    }
  }
  const readyPromise = triggerOnReady(inner);
  if (isPromise(readyPromise)) await readyPromise;
  if (notFoundToThrow) throw notFoundToThrow;
  if (inner.serialError && !inner.preload && !inner.onReady) throw inner.serialError;
  return inner.matches;
}
function preloadRouteComponents(route, componentTypesToLoad) {
  const preloads = componentTypesToLoad.map((type) => route.options[type]?.preload?.()).filter(Boolean);
  if (preloads.length === 0) return void 0;
  return Promise.all(preloads);
}
function loadRouteChunk(route, componentTypesToLoad = componentTypes) {
  if (!route._lazyLoaded && route._lazyPromise === void 0) if (route.lazyFn) route._lazyPromise = route.lazyFn().then((lazyRoute) => {
    const { id: _id, ...options } = lazyRoute.options;
    Object.assign(route.options, options);
    route._lazyLoaded = true;
    route._lazyPromise = void 0;
  });
  else route._lazyLoaded = true;
  const runAfterLazy = () => route._componentsLoaded ? void 0 : componentTypesToLoad === componentTypes ? (() => {
    if (route._componentsPromise === void 0) {
      const componentsPromise = preloadRouteComponents(route, componentTypes);
      if (componentsPromise) route._componentsPromise = componentsPromise.then(() => {
        route._componentsLoaded = true;
        route._componentsPromise = void 0;
      });
      else route._componentsLoaded = true;
    }
    return route._componentsPromise;
  })() : preloadRouteComponents(route, componentTypesToLoad);
  return route._lazyPromise ? route._lazyPromise.then(runAfterLazy) : runAfterLazy();
}
function makeMaybe(value, error) {
  if (error) return {
    status: "error",
    error
  };
  return {
    status: "success",
    value
  };
}
function routeNeedsPreload(route) {
  for (const componentType of componentTypes) if (route.options[componentType]?.preload) return true;
  return false;
}
const componentTypes = [
  "component",
  "errorComponent",
  "pendingComponent",
  "notFoundComponent"
];
function createNonReactiveMutableStore(initialValue) {
  let value = initialValue;
  return {
    get() {
      return value;
    },
    set(nextOrUpdater) {
      value = functionalUpdate$1(nextOrUpdater, value);
    }
  };
}
function createNonReactiveReadonlyStore(read) {
  return { get() {
    return read();
  } };
}
function createRouterStores(initialState, config) {
  const { createMutableStore, createReadonlyStore, batch, init } = config;
  const matchStores = /* @__PURE__ */ new Map();
  const pendingMatchStores = /* @__PURE__ */ new Map();
  const cachedMatchStores = /* @__PURE__ */ new Map();
  const status = createMutableStore(initialState.status);
  const loadedAt = createMutableStore(initialState.loadedAt);
  const isLoading = createMutableStore(initialState.isLoading);
  const isTransitioning = createMutableStore(initialState.isTransitioning);
  const location2 = createMutableStore(initialState.location);
  const resolvedLocation = createMutableStore(initialState.resolvedLocation);
  const statusCode = createMutableStore(initialState.statusCode);
  const redirect2 = createMutableStore(initialState.redirect);
  const matchesId = createMutableStore([]);
  const pendingIds = createMutableStore([]);
  const cachedIds = createMutableStore([]);
  const matches = createReadonlyStore(() => readPoolMatches(matchStores, matchesId.get()));
  const pendingMatches = createReadonlyStore(() => readPoolMatches(pendingMatchStores, pendingIds.get()));
  const cachedMatches = createReadonlyStore(() => readPoolMatches(cachedMatchStores, cachedIds.get()));
  const firstId = createReadonlyStore(() => matchesId.get()[0]);
  const hasPending = createReadonlyStore(() => matchesId.get().some((matchId) => {
    return matchStores.get(matchId)?.get().status === "pending";
  }));
  const matchRouteDeps = createReadonlyStore(() => ({
    locationHref: location2.get().href,
    resolvedLocationHref: resolvedLocation.get()?.href,
    status: status.get()
  }));
  const __store = createReadonlyStore(() => ({
    status: status.get(),
    loadedAt: loadedAt.get(),
    isLoading: isLoading.get(),
    isTransitioning: isTransitioning.get(),
    matches: matches.get(),
    location: location2.get(),
    resolvedLocation: resolvedLocation.get(),
    statusCode: statusCode.get(),
    redirect: redirect2.get()
  }));
  const matchStoreByRouteIdCache = createLRUCache(64);
  function getRouteMatchStore(routeId) {
    let cached = matchStoreByRouteIdCache.get(routeId);
    if (!cached) {
      cached = createReadonlyStore(() => {
        const ids = matchesId.get();
        for (const id of ids) {
          const matchStore = matchStores.get(id);
          if (matchStore && matchStore.routeId === routeId) return matchStore.get();
        }
      });
      matchStoreByRouteIdCache.set(routeId, cached);
    }
    return cached;
  }
  const store = {
    status,
    loadedAt,
    isLoading,
    isTransitioning,
    location: location2,
    resolvedLocation,
    statusCode,
    redirect: redirect2,
    matchesId,
    pendingIds,
    cachedIds,
    matches,
    pendingMatches,
    cachedMatches,
    firstId,
    hasPending,
    matchRouteDeps,
    matchStores,
    pendingMatchStores,
    cachedMatchStores,
    __store,
    getRouteMatchStore,
    setMatches,
    setPending,
    setCached
  };
  setMatches(initialState.matches);
  init?.(store);
  function setMatches(nextMatches) {
    reconcileMatchPool(nextMatches, matchStores, matchesId, createMutableStore, batch);
  }
  function setPending(nextMatches) {
    reconcileMatchPool(nextMatches, pendingMatchStores, pendingIds, createMutableStore, batch);
  }
  function setCached(nextMatches) {
    reconcileMatchPool(nextMatches, cachedMatchStores, cachedIds, createMutableStore, batch);
  }
  return store;
}
function readPoolMatches(pool, ids) {
  const matches = [];
  for (const id of ids) {
    const matchStore = pool.get(id);
    if (matchStore) matches.push(matchStore.get());
  }
  return matches;
}
function reconcileMatchPool(nextMatches, pool, idStore, createMutableStore, batch) {
  const nextIds = nextMatches.map((d2) => d2.id);
  const nextIdSet = new Set(nextIds);
  batch(() => {
    for (const id of pool.keys()) if (!nextIdSet.has(id)) pool.delete(id);
    for (const nextMatch of nextMatches) {
      const existing = pool.get(nextMatch.id);
      if (!existing) {
        const matchStore = createMutableStore(nextMatch);
        matchStore.routeId = nextMatch.routeId;
        pool.set(nextMatch.id, matchStore);
        continue;
      }
      existing.routeId = nextMatch.routeId;
      if (existing.get() !== nextMatch) existing.set(nextMatch);
    }
    if (!arraysEqual(idStore.get(), nextIds)) idStore.set(nextIds);
  });
}
function getLocationChangeInfo(location2, resolvedLocation) {
  const fromLocation = resolvedLocation;
  const toLocation = location2;
  return {
    fromLocation,
    toLocation,
    pathChanged: fromLocation?.pathname !== toLocation.pathname,
    hrefChanged: fromLocation?.href !== toLocation.href,
    hashChanged: fromLocation?.hash !== toLocation.hash
  };
}
const locationHistoryActions = /* @__PURE__ */ new WeakMap();
var RouterCore = class {
  /**
  * @deprecated Use the `createRouter` function instead
  */
  constructor(options, getStoreConfig) {
    this.tempLocationKey = `${Math.round(Math.random() * 1e7)}`;
    this.resetNextScroll = true;
    this.shouldViewTransition = void 0;
    this.isViewTransitionTypesSupported = void 0;
    this.subscribers = /* @__PURE__ */ new Set();
    this.isScrollRestoring = false;
    this.isScrollRestorationSetup = false;
    this.routeBranchCache = /* @__PURE__ */ new WeakMap();
    this.startTransition = (fn2) => fn2();
    this.update = (newOptions) => {
      const prevOptions = this.options;
      const prevBasepath = this.basepath ?? prevOptions?.basepath ?? "/";
      const basepathWasUnset = this.basepath === void 0;
      const prevRewriteOption = prevOptions?.rewrite;
      this.options = {
        ...prevOptions,
        ...newOptions
      };
      this.isServer = this.options.isServer ?? typeof document === "undefined";
      this.protocolAllowlist = new Set(this.options.protocolAllowlist);
      if (this.options.pathParamsAllowedCharacters) this.pathParamsDecoder = compileDecodeCharMap(this.options.pathParamsAllowedCharacters);
      if (!this.history || this.options.history && this.options.history !== this.history) if (!this.options.history) ;
      else this.history = this.options.history;
      this.origin = this.options.origin;
      if (!this.origin) this.origin = "http://localhost";
      if (this.history) this.updateLatestLocation();
      if (this.options.routeTree !== this.routeTree) {
        this.routeTree = this.options.routeTree;
        let processRouteTreeResult;
        if (globalThis.__TSR_CACHE__ && globalThis.__TSR_CACHE__.routeTree === this.routeTree) {
          const cached = globalThis.__TSR_CACHE__;
          this.resolvePathCache = cached.resolvePathCache;
          processRouteTreeResult = cached.processRouteTreeResult;
        } else {
          this.resolvePathCache = createLRUCache(1e3);
          processRouteTreeResult = this.buildRouteTree();
          if (globalThis.__TSR_CACHE__ === void 0) globalThis.__TSR_CACHE__ = {
            routeTree: this.routeTree,
            processRouteTreeResult,
            resolvePathCache: this.resolvePathCache
          };
        }
        this.setRoutes(processRouteTreeResult);
      }
      if (!this.stores && this.latestLocation) {
        const config = this.getStoreConfig(this);
        this.batch = config.batch;
        this.stores = createRouterStores(getInitialRouterState(this.latestLocation), config);
      }
      let needsLocationUpdate = false;
      const nextBasepath = this.options.basepath ?? "/";
      const nextRewriteOption = this.options.rewrite;
      if (basepathWasUnset || prevBasepath !== nextBasepath || prevRewriteOption !== nextRewriteOption) {
        this.basepath = nextBasepath;
        const rewrites = [];
        const trimmed = trimPath(nextBasepath);
        if (trimmed && trimmed !== "/") rewrites.push(rewriteBasepath({ basepath: nextBasepath }));
        if (nextRewriteOption) rewrites.push(nextRewriteOption);
        this.rewrite = rewrites.length === 0 ? void 0 : rewrites.length === 1 ? rewrites[0] : composeRewrites(rewrites);
        if (this.history) this.updateLatestLocation();
        needsLocationUpdate = true;
      }
      if (needsLocationUpdate && this.stores) this.stores.location.set(this.latestLocation);
      if (typeof window !== "undefined" && "CSS" in window && typeof window.CSS?.supports === "function") this.isViewTransitionTypesSupported = window.CSS.supports("selector(:active-view-transition-type(a))");
    };
    this.updateLatestLocation = () => {
      this.latestLocation = this.parseLocation(this.history.location, this.latestLocation);
    };
    this.buildRouteTree = () => {
      const result = processRouteTree(this.routeTree, this.options.caseSensitive, (route, i2) => {
        route.init({ originalIndex: i2 });
      });
      if (this.options.routeMasks) processRouteMasks(this.options.routeMasks, result.processedTree);
      return result;
    };
    this.subscribe = (eventType, fn2) => {
      const listener = {
        eventType,
        fn: fn2
      };
      this.subscribers.add(listener);
      return () => {
        this.subscribers.delete(listener);
      };
    };
    this.emit = (routerEvent) => {
      this.subscribers.forEach((listener) => {
        if (listener.eventType === routerEvent.type) listener.fn(routerEvent);
      });
    };
    this.parseLocation = (locationToParse, previousLocation) => {
      const parse = ({ pathname, search, hash, href, state }) => {
        if (!this.rewrite && !/[ \x00-\x1f\x7f\u0080-\uffff]/.test(pathname)) {
          const parsedSearch2 = this.options.parseSearch(search);
          const searchStr2 = this.options.stringifySearch(parsedSearch2);
          return {
            href: pathname + searchStr2 + hash,
            publicHref: pathname + searchStr2 + hash,
            pathname: decodePath(pathname).path,
            external: false,
            searchStr: searchStr2,
            search: nullReplaceEqualDeep(previousLocation?.search, parsedSearch2),
            hash: decodePath(hash.slice(1)).path,
            state: replaceEqualDeep$1(previousLocation?.state, state)
          };
        }
        const fullUrl = new URL(href, this.origin);
        const url = executeRewriteInput(this.rewrite, fullUrl);
        const parsedSearch = this.options.parseSearch(url.search);
        const searchStr = this.options.stringifySearch(parsedSearch);
        url.search = searchStr;
        return {
          href: url.href.replace(url.origin, ""),
          publicHref: href,
          pathname: decodePath(url.pathname).path,
          external: !!this.rewrite && url.origin !== this.origin,
          searchStr,
          search: nullReplaceEqualDeep(previousLocation?.search, parsedSearch),
          hash: decodePath(url.hash.slice(1)).path,
          state: replaceEqualDeep$1(previousLocation?.state, state)
        };
      };
      const location2 = parse(locationToParse);
      const { __tempLocation, __tempKey } = location2.state;
      if (__tempLocation && (!__tempKey || __tempKey === this.tempLocationKey)) {
        const parsedTempLocation = parse(__tempLocation);
        parsedTempLocation.state.key = location2.state.key;
        parsedTempLocation.state.__TSR_key = location2.state.__TSR_key;
        delete parsedTempLocation.state.__tempLocation;
        return {
          ...parsedTempLocation,
          maskedLocation: location2
        };
      }
      return location2;
    };
    this.resolvePathWithBase = (from, path) => {
      return resolvePath({
        base: from,
        to: path.includes("//") ? cleanPath(path) : path,
        trailingSlash: this.options.trailingSlash,
        cache: this.resolvePathCache
      });
    };
    this.matchRoutes = (pathnameOrNext, locationSearchOrOpts, opts) => {
      if (typeof pathnameOrNext === "string") return this.matchRoutesInternal({
        pathname: pathnameOrNext,
        search: locationSearchOrOpts
      }, opts);
      return this.matchRoutesInternal(pathnameOrNext, locationSearchOrOpts);
    };
    this.getMatchedRoutes = (pathname) => {
      return getMatchedRoutes({
        pathname,
        routesById: this.routesById,
        processedTree: this.processedTree
      });
    };
    this.cancelMatch = (id) => {
      const match = this.getMatch(id);
      if (!match) return;
      match.abortController.abort();
      clearTimeout(match._nonReactive.pendingTimeout);
      match._nonReactive.pendingTimeout = void 0;
    };
    this.cancelMatches = () => {
      this.stores.pendingIds.get().forEach((matchId) => {
        this.cancelMatch(matchId);
      });
      this.stores.matchesId.get().forEach((matchId) => {
        if (this.stores.pendingMatchStores.has(matchId)) return;
        const match = this.stores.matchStores.get(matchId)?.get();
        if (!match) return;
        if (match.status === "pending" || match.isFetching === "loader") this.cancelMatch(matchId);
      });
    };
    this.buildLocation = (opts) => {
      const build = (dest = {}) => {
        const currentLocation = dest._fromLocation || this.pendingBuiltLocation || this.latestLocation;
        const lightweightResult = this.matchRoutesLightweight(currentLocation);
        if (dest.from && false) ;
        const defaultedFromPath = dest.unsafeRelative === "path" ? currentLocation.pathname : dest.from ?? lightweightResult.fullPath;
        const destTo = dest.to ? `${dest.to}` : void 0;
        const fromSearch = lightweightResult.search;
        const fromParams = Object.assign(/* @__PURE__ */ Object.create(null), lightweightResult.params);
        const sourcePath = destTo?.charCodeAt(0) === 47 ? "/" : this.resolvePathWithBase(defaultedFromPath, ".");
        const nextTo = destTo ? this.resolvePathWithBase(sourcePath, destTo) : sourcePath;
        const nextParams = dest.params === false || dest.params === null ? /* @__PURE__ */ Object.create(null) : (dest.params ?? true) === true ? fromParams : Object.assign(fromParams, functionalUpdate$1(dest.params, fromParams));
        const destRoute = this.routesByPath[trimPathRight(nextTo)];
        let destRoutes;
        if (destRoute) destRoutes = this.getRouteBranch(destRoute);
        else if (nextTo.includes("$")) destRoutes = [];
        else {
          const destMatchResult = this.getMatchedRoutes(nextTo);
          destRoutes = destMatchResult.matchedRoutes;
          if (this.options.notFoundRoute && (!destMatchResult.foundRoute || destMatchResult.foundRoute.path !== "/" && destMatchResult.routeParams["**"])) destRoutes = [...destRoutes, this.options.notFoundRoute];
        }
        if (destRoutes.length && hasKeys(nextParams)) for (const route of destRoutes) {
          const fn2 = route.options.params?.stringify ?? route.options.stringifyParams;
          if (fn2) try {
            Object.assign(nextParams, fn2(nextParams));
          } catch {
          }
        }
        const nextPathname = opts.leaveParams ? nextTo : decodePath(interpolatePath({
          path: nextTo,
          params: nextParams,
          decoder: this.pathParamsDecoder,
          server: this.isServer
        }).interpolatedPath).path;
        let nextSearch = fromSearch;
        if (opts._includeValidateSearch && this.options.search?.strict) {
          const validatedSearch = {};
          destRoutes.forEach((route) => {
            if (route.options.validateSearch) try {
              Object.assign(validatedSearch, validateSearch(route.options.validateSearch, {
                ...validatedSearch,
                ...nextSearch
              }));
            } catch {
            }
          });
          nextSearch = validatedSearch;
        }
        nextSearch = applySearchMiddleware({
          search: nextSearch,
          dest,
          destRoutes,
          _includeValidateSearch: opts._includeValidateSearch
        });
        nextSearch = nullReplaceEqualDeep(fromSearch, nextSearch);
        const searchStr = this.options.stringifySearch(nextSearch);
        const hash = dest.hash === true ? currentLocation.hash : dest.hash ? functionalUpdate$1(dest.hash, currentLocation.hash) : void 0;
        const hashStr = hash ? `#${hash}` : "";
        let nextState = dest.state === true ? currentLocation.state : dest.state ? functionalUpdate$1(dest.state, currentLocation.state) : {};
        nextState = replaceEqualDeep$1(currentLocation.state, nextState);
        const fullPath = `${nextPathname}${searchStr}${hashStr}`;
        let href;
        let publicHref;
        let external = false;
        if (this.rewrite) {
          const url = new URL(fullPath, this.origin);
          const rewrittenUrl = executeRewriteOutput(this.rewrite, url);
          href = url.href.replace(url.origin, "");
          if (rewrittenUrl.origin !== this.origin) {
            publicHref = rewrittenUrl.href;
            external = true;
          } else publicHref = rewrittenUrl.pathname + rewrittenUrl.search + rewrittenUrl.hash;
        } else {
          href = encodePathLikeUrl(fullPath);
          publicHref = href;
        }
        return {
          publicHref,
          href,
          pathname: nextPathname,
          search: nextSearch,
          searchStr,
          state: nextState,
          hash: hash ?? "",
          external,
          unmaskOnReload: dest.unmaskOnReload
        };
      };
      const buildWithMatches = (dest = {}, maskedDest) => {
        const next = build(dest);
        let maskedNext = maskedDest ? build(maskedDest) : void 0;
        if (!maskedNext) {
          const params = /* @__PURE__ */ Object.create(null);
          if (this.options.routeMasks) {
            const match = findFlatMatch(next.pathname, this.processedTree);
            if (match) {
              Object.assign(params, match.rawParams);
              const { from: _from, params: maskParams, ...maskProps } = match.route;
              const nextParams = maskParams === false || maskParams === null ? /* @__PURE__ */ Object.create(null) : (maskParams ?? true) === true ? params : Object.assign(params, functionalUpdate$1(maskParams, params));
              maskedDest = {
                from: opts.from,
                ...maskProps,
                params: nextParams
              };
              maskedNext = build(maskedDest);
            }
          }
        }
        if (maskedNext) next.maskedLocation = maskedNext;
        return next;
      };
      if (opts.mask) return buildWithMatches(opts, {
        from: opts.from,
        ...opts.mask
      });
      return buildWithMatches(opts);
    };
    this.commitLocation = async ({ viewTransition, ignoreBlocker, ...next }) => {
      let historyAction;
      const isSameState = () => {
        const ignoredProps = [
          "key",
          "__TSR_key",
          "__TSR_index",
          "__hashScrollIntoViewOptions"
        ];
        ignoredProps.forEach((prop) => {
          next.state[prop] = this.latestLocation.state[prop];
        });
        const isEqual = deepEqual(next.state, this.latestLocation.state);
        ignoredProps.forEach((prop) => {
          delete next.state[prop];
        });
        return isEqual;
      };
      const isSameUrl = trimPathRight(this.latestLocation.href) === trimPathRight(next.href);
      let previousCommitPromise = this.commitLocationPromise;
      this.commitLocationPromise = createControlledPromise(() => {
        previousCommitPromise?.resolve();
        previousCommitPromise = void 0;
      });
      if (isSameUrl && isSameState()) this.load();
      else {
        let { maskedLocation, hashScrollIntoView, ...nextHistory } = next;
        if (maskedLocation) {
          nextHistory = {
            ...maskedLocation,
            state: {
              ...maskedLocation.state,
              __tempKey: void 0,
              __tempLocation: {
                ...nextHistory,
                search: nextHistory.searchStr,
                state: {
                  ...nextHistory.state,
                  __tempKey: void 0,
                  __tempLocation: void 0,
                  __TSR_key: void 0,
                  key: void 0
                }
              }
            }
          };
          if (nextHistory.unmaskOnReload ?? this.options.unmaskOnReload ?? false) nextHistory.state.__tempKey = this.tempLocationKey;
        }
        nextHistory.state.__hashScrollIntoViewOptions = hashScrollIntoView ?? this.options.defaultHashScrollIntoView ?? true;
        this.shouldViewTransition = viewTransition;
        historyAction = next.replace ? "REPLACE" : "PUSH";
        this.history[historyAction === "REPLACE" ? "replace" : "push"](nextHistory.publicHref, nextHistory.state, { ignoreBlocker });
      }
      this.resetNextScroll = next.resetScroll ?? true;
      if (!this.history.subscribers.size) this.load(historyAction ? { action: { type: historyAction } } : void 0);
      return this.commitLocationPromise;
    };
    this.buildAndCommitLocation = ({ replace, resetScroll, hashScrollIntoView, viewTransition, ignoreBlocker, href, ...rest } = {}) => {
      if (href) {
        const currentIndex = this.history.location.state.__TSR_index;
        const parsed = parseHref(href, { __TSR_index: replace ? currentIndex : currentIndex + 1 });
        const hrefUrl = new URL(parsed.pathname, this.origin);
        rest.to = executeRewriteInput(this.rewrite, hrefUrl).pathname;
        rest.search = this.options.parseSearch(parsed.search);
        rest.hash = parsed.hash.slice(1);
      }
      const location2 = this.buildLocation({
        ...rest,
        _includeValidateSearch: true
      });
      this.pendingBuiltLocation = location2;
      const commitPromise = this.commitLocation({
        ...location2,
        viewTransition,
        replace,
        resetScroll,
        hashScrollIntoView,
        ignoreBlocker
      });
      Promise.resolve().then(() => {
        if (this.pendingBuiltLocation === location2) this.pendingBuiltLocation = void 0;
      });
      return commitPromise;
    };
    this.navigate = async ({ to: to2, reloadDocument, href, publicHref, ...rest }) => {
      let hrefIsUrl = false;
      if (href) try {
        new URL(`${href}`);
        hrefIsUrl = true;
      } catch {
      }
      if (hrefIsUrl && !reloadDocument) reloadDocument = true;
      if (reloadDocument) {
        if (to2 !== void 0 || !href) {
          const location2 = this.buildLocation({
            to: to2,
            ...rest
          });
          href = href ?? location2.publicHref;
          publicHref = publicHref ?? location2.publicHref;
        }
        const reloadHref = !hrefIsUrl && publicHref ? publicHref : href;
        if (isDangerousProtocol(reloadHref, this.protocolAllowlist)) {
          return Promise.resolve();
        }
        if (!rest.ignoreBlocker) {
          const blockers = this.history.getBlockers?.() ?? [];
          for (const blocker of blockers) if (blocker?.blockerFn) {
            if (await blocker.blockerFn({
              currentLocation: this.latestLocation,
              nextLocation: this.latestLocation,
              action: "PUSH"
            })) return Promise.resolve();
          }
        }
        if (rest.replace) window.location.replace(reloadHref);
        else window.location.href = reloadHref;
        return Promise.resolve();
      }
      return this.buildAndCommitLocation({
        ...rest,
        href,
        to: to2,
        _isNavigate: true
      });
    };
    this.beforeLoad = () => {
      this.cancelMatches();
      this.updateLatestLocation();
      {
        const nextLocation = this.buildLocation({
          to: this.latestLocation.pathname,
          search: true,
          params: true,
          hash: true,
          state: true,
          _includeValidateSearch: true
        });
        if (this.latestLocation.publicHref !== nextLocation.publicHref) {
          const href = this.getParsedLocationHref(nextLocation);
          if (nextLocation.external) throw redirect({ href });
          else throw redirect({
            href,
            _builtLocation: nextLocation
          });
        }
      }
      const pendingMatches = this.matchRoutes(this.latestLocation);
      const nextCachedMatches = this.stores.cachedMatches.get().filter((d2) => !pendingMatches.some((e2) => e2.id === d2.id));
      this.batch(() => {
        this.stores.status.set("pending");
        this.stores.statusCode.set(200);
        this.stores.isLoading.set(true);
        this.stores.location.set(this.latestLocation);
        this.stores.setPending(pendingMatches);
        this.stores.setCached(nextCachedMatches);
      });
    };
    this.load = async (opts) => {
      const historyAction = opts?.action?.type;
      let redirect2;
      let notFound;
      let loadPromise;
      const previousLocation = this.stores.resolvedLocation.get() ?? this.stores.location.get();
      loadPromise = new Promise((resolve) => {
        this.startTransition(async () => {
          try {
            this.beforeLoad();
            if (historyAction) locationHistoryActions.set(this.latestLocation, historyAction);
            else locationHistoryActions.delete(this.latestLocation);
            const next = this.latestLocation;
            const locationChangeInfo = getLocationChangeInfo(next, this.stores.resolvedLocation.get());
            if (!this.stores.redirect.get()) this.emit({
              type: "onBeforeNavigate",
              ...locationChangeInfo
            });
            this.emit({
              type: "onBeforeLoad",
              ...locationChangeInfo
            });
            await loadMatches({
              router: this,
              sync: opts?.sync,
              forceStaleReload: previousLocation.href === next.href,
              matches: this.stores.pendingMatches.get(),
              location: next,
              updateMatch: this.updateMatch,
              onReady: async () => {
                this.startTransition(() => {
                  this.startViewTransition(async () => {
                    let exitingMatches = null;
                    let hookExitingMatches = null;
                    let hookEnteringMatches = null;
                    let hookStayingMatches = null;
                    this.batch(() => {
                      const pendingMatches = this.stores.pendingMatches.get();
                      const mountPending = pendingMatches.length;
                      const currentMatches = this.stores.matches.get();
                      exitingMatches = mountPending ? currentMatches.filter((match) => !this.stores.pendingMatchStores.has(match.id)) : null;
                      const pendingRouteIds = /* @__PURE__ */ new Set();
                      for (const s2 of this.stores.pendingMatchStores.values()) if (s2.routeId) pendingRouteIds.add(s2.routeId);
                      const activeRouteIds = /* @__PURE__ */ new Set();
                      for (const s2 of this.stores.matchStores.values()) if (s2.routeId) activeRouteIds.add(s2.routeId);
                      hookExitingMatches = mountPending ? currentMatches.filter((match) => !pendingRouteIds.has(match.routeId)) : null;
                      hookEnteringMatches = mountPending ? pendingMatches.filter((match) => !activeRouteIds.has(match.routeId)) : null;
                      hookStayingMatches = mountPending ? pendingMatches.filter((match) => activeRouteIds.has(match.routeId)) : currentMatches;
                      this.stores.isLoading.set(false);
                      this.stores.loadedAt.set(Date.now());
                      if (mountPending) {
                        this.stores.setMatches(pendingMatches);
                        this.stores.setPending([]);
                        this.stores.setCached([...this.stores.cachedMatches.get(), ...exitingMatches.filter((d2) => d2.status !== "error" && d2.status !== "notFound" && d2.status !== "redirected")]);
                        this.clearExpiredCache();
                      }
                    });
                    for (const [matches, hook] of [
                      [hookExitingMatches, "onLeave"],
                      [hookEnteringMatches, "onEnter"],
                      [hookStayingMatches, "onStay"]
                    ]) {
                      if (!matches) continue;
                      for (const match of matches) this.looseRoutesById[match.routeId].options[hook]?.(match);
                    }
                  });
                });
              }
            });
          } catch (err) {
            if (isRedirect(err)) {
              redirect2 = err;
            } else if (isNotFound(err)) notFound = err;
            const nextStatusCode = redirect2 ? redirect2.status : notFound ? 404 : this.stores.matches.get().some((d2) => d2.status === "error") ? 500 : 200;
            this.batch(() => {
              this.stores.statusCode.set(nextStatusCode);
              this.stores.redirect.set(redirect2);
            });
          }
          if (this.latestLoadPromise === loadPromise) {
            this.commitLocationPromise?.resolve();
            this.latestLoadPromise = void 0;
            this.commitLocationPromise = void 0;
          }
          resolve();
        });
      });
      this.latestLoadPromise = loadPromise;
      await loadPromise;
      while (this.latestLoadPromise && loadPromise !== this.latestLoadPromise) await this.latestLoadPromise;
      let newStatusCode = void 0;
      if (this.hasNotFoundMatch()) newStatusCode = 404;
      else if (this.stores.matches.get().some((d2) => d2.status === "error")) newStatusCode = 500;
      if (newStatusCode !== void 0) this.stores.statusCode.set(newStatusCode);
    };
    this.startViewTransition = (fn2) => {
      const shouldViewTransition = this.shouldViewTransition ?? this.options.defaultViewTransition;
      this.shouldViewTransition = void 0;
      if (shouldViewTransition && typeof document !== "undefined" && "startViewTransition" in document && typeof document.startViewTransition === "function") {
        let startViewTransitionParams;
        if (typeof shouldViewTransition === "object" && this.isViewTransitionTypesSupported) {
          const next = this.latestLocation;
          const prevLocation = this.stores.resolvedLocation.get();
          const resolvedViewTransitionTypes = typeof shouldViewTransition.types === "function" ? shouldViewTransition.types(getLocationChangeInfo(next, prevLocation)) : shouldViewTransition.types;
          if (resolvedViewTransitionTypes === false) {
            fn2();
            return;
          }
          startViewTransitionParams = {
            update: fn2,
            types: resolvedViewTransitionTypes
          };
        } else startViewTransitionParams = fn2;
        document.startViewTransition(startViewTransitionParams);
      } else fn2();
    };
    this.updateMatch = (id, updater) => {
      this.startTransition(() => {
        const pendingMatch = this.stores.pendingMatchStores.get(id);
        if (pendingMatch) {
          pendingMatch.set(updater);
          return;
        }
        const activeMatch = this.stores.matchStores.get(id);
        if (activeMatch) {
          activeMatch.set(updater);
          return;
        }
        const cachedMatch = this.stores.cachedMatchStores.get(id);
        if (cachedMatch) {
          const next = updater(cachedMatch.get());
          if (next.status === "redirected") {
            if (this.stores.cachedMatchStores.delete(id)) this.stores.cachedIds.set((prev) => prev.filter((matchId) => matchId !== id));
          } else cachedMatch.set(next);
        }
      });
    };
    this.getMatch = (matchId) => {
      return this.stores.cachedMatchStores.get(matchId)?.get() ?? this.stores.pendingMatchStores.get(matchId)?.get() ?? this.stores.matchStores.get(matchId)?.get();
    };
    this.invalidate = (opts) => {
      const invalidate = (d2) => {
        if (opts?.filter?.(d2) ?? true) return {
          ...d2,
          invalid: true,
          ...opts?.forcePending || d2.status === "error" || d2.status === "notFound" ? {
            status: "pending",
            error: void 0
          } : void 0
        };
        return d2;
      };
      this.batch(() => {
        this.stores.setMatches(this.stores.matches.get().map(invalidate));
        this.stores.setCached(this.stores.cachedMatches.get().map(invalidate));
        this.stores.setPending(this.stores.pendingMatches.get().map(invalidate));
      });
      this.shouldViewTransition = false;
      return this.load({ sync: opts?.sync });
    };
    this.getParsedLocationHref = (location2) => {
      return location2.publicHref || "/";
    };
    this.resolveRedirect = (redirect2) => {
      const locationHeader = redirect2.headers.get("Location");
      if (!redirect2.options.href || redirect2.options._builtLocation) {
        const location2 = redirect2.options._builtLocation ?? this.buildLocation(redirect2.options);
        const href = this.getParsedLocationHref(location2);
        redirect2.options.href = href;
        redirect2.headers.set("Location", href);
      } else if (locationHeader) try {
        const url = new URL(locationHeader);
        if (this.origin && url.origin === this.origin) {
          const href = url.pathname + url.search + url.hash;
          redirect2.options.href = href;
          redirect2.headers.set("Location", href);
        }
      } catch {
      }
      if (redirect2.options.href && !redirect2.options._builtLocation && isDangerousProtocol(redirect2.options.href, this.protocolAllowlist)) throw new Error("Redirect blocked: unsafe protocol");
      if (!redirect2.headers.get("Location")) redirect2.headers.set("Location", redirect2.options.href);
      return redirect2;
    };
    this.clearCache = (opts) => {
      const filter = opts?.filter;
      if (filter !== void 0) this.stores.setCached(this.stores.cachedMatches.get().filter((m2) => !filter(m2)));
      else this.stores.setCached([]);
    };
    this.clearExpiredCache = () => {
      const now = Date.now();
      const filter = (d2) => {
        const route = this.looseRoutesById[d2.routeId];
        if (!route.options.loader) return true;
        const gcTime = (d2.preload ? route.options.preloadGcTime ?? this.options.defaultPreloadGcTime : route.options.gcTime ?? this.options.defaultGcTime) ?? 300 * 1e3;
        if (d2.status === "error") return true;
        return now - d2.updatedAt >= gcTime;
      };
      this.clearCache({ filter });
    };
    this.loadRouteChunk = loadRouteChunk;
    this.preloadRoute = async (opts) => {
      const next = opts._builtLocation ?? this.buildLocation(opts);
      let matches = this.matchRoutes(next, {
        throwOnError: true,
        preload: true,
        dest: opts
      });
      const activeMatchIds = /* @__PURE__ */ new Set([...this.stores.matchesId.get(), ...this.stores.pendingIds.get()]);
      const loadedMatchIds = /* @__PURE__ */ new Set([...activeMatchIds, ...this.stores.cachedIds.get()]);
      const matchesToCache = matches.filter((match) => !loadedMatchIds.has(match.id));
      if (matchesToCache.length) {
        const cachedMatches = this.stores.cachedMatches.get();
        this.stores.setCached([...cachedMatches, ...matchesToCache]);
      }
      try {
        matches = await loadMatches({
          router: this,
          matches,
          location: next,
          preload: true,
          updateMatch: (id, updater) => {
            if (activeMatchIds.has(id)) matches = matches.map((d2) => d2.id === id ? updater(d2) : d2);
            else this.updateMatch(id, updater);
          }
        });
        return matches;
      } catch (err) {
        if (isRedirect(err)) {
          if (err.options.reloadDocument) return;
          return await this.preloadRoute({
            ...err.options,
            _fromLocation: next
          });
        }
        if (!isNotFound(err)) console.error(err);
        return;
      }
    };
    this.matchRoute = (location2, opts) => {
      const matchLocation = {
        ...location2,
        to: location2.to ? this.resolvePathWithBase(location2.from || "", location2.to) : void 0,
        params: location2.params || {},
        leaveParams: true
      };
      const next = this.buildLocation(matchLocation);
      if (opts?.pending && this.stores.status.get() !== "pending") return false;
      const baseLocation = (opts?.pending === void 0 ? !this.stores.isLoading.get() : opts.pending) ? this.latestLocation : this.stores.resolvedLocation.get() || this.stores.location.get();
      const match = findSingleMatch(next.pathname, opts?.caseSensitive ?? false, opts?.fuzzy ?? false, baseLocation.pathname, this.processedTree);
      if (!match) return false;
      if (location2.params) {
        if (!deepEqual(match.rawParams, location2.params, { partial: true })) return false;
      }
      if (opts?.includeSearch ?? true) return deepEqual(baseLocation.search, next.search, { partial: true }) ? match.rawParams : false;
      return match.rawParams;
    };
    this.hasNotFoundMatch = () => {
      return this.stores.matches.get().some((d2) => d2.status === "notFound" || d2.globalNotFound);
    };
    this.getStoreConfig = getStoreConfig;
    this.update({
      defaultPreloadDelay: 50,
      defaultPendingMs: 1e3,
      defaultPendingMinMs: 500,
      context: void 0,
      ...options,
      caseSensitive: options.caseSensitive ?? false,
      notFoundMode: options.notFoundMode ?? "fuzzy",
      stringifySearch: options.stringifySearch ?? defaultStringifySearch,
      parseSearch: options.parseSearch ?? defaultParseSearch,
      protocolAllowlist: options.protocolAllowlist ?? DEFAULT_PROTOCOL_ALLOWLIST
    });
    if (typeof document !== "undefined") self.__TSR_ROUTER__ = this;
  }
  isShell() {
    return !!this.options.isShell;
  }
  isPrerendering() {
    return !!this.options.isPrerendering;
  }
  get state() {
    return this.stores.__store.get();
  }
  setRoutes({ routesById, routesByPath, processedTree }) {
    this.routesById = routesById;
    this.routesByPath = routesByPath;
    this.processedTree = processedTree;
    const notFoundRoute = this.options.notFoundRoute;
    if (notFoundRoute) {
      notFoundRoute.init({ originalIndex: 99999999999 });
      this.routesById[notFoundRoute.id] = notFoundRoute;
    }
  }
  getRouteBranch(route) {
    let branch = this.routeBranchCache.get(route);
    if (!branch) {
      branch = buildRouteBranch(route);
      this.routeBranchCache.set(route, branch);
    }
    return branch;
  }
  get looseRoutesById() {
    return this.routesById;
  }
  getParentContext(parentMatch) {
    return !parentMatch?.id ? this.options.context ?? void 0 : parentMatch.context ?? this.options.context ?? void 0;
  }
  matchRoutesInternal(next, opts) {
    const matchedRoutesResult = this.getMatchedRoutes(next.pathname);
    const { foundRoute, routeParams } = matchedRoutesResult;
    let { matchedRoutes } = matchedRoutesResult;
    let isGlobalNotFound = false;
    if (foundRoute ? foundRoute.path !== "/" && routeParams["**"] : trimPathRight(next.pathname)) if (this.options.notFoundRoute) matchedRoutes = [...matchedRoutes, this.options.notFoundRoute];
    else isGlobalNotFound = true;
    const globalNotFoundRouteId = isGlobalNotFound ? findGlobalNotFoundRouteId(this.options.notFoundMode, matchedRoutes) : void 0;
    const matches = new Array(matchedRoutes.length);
    const previousActiveMatchesByRouteId = /* @__PURE__ */ new Map();
    for (const store of this.stores.matchStores.values()) if (store.routeId) previousActiveMatchesByRouteId.set(store.routeId, store.get());
    for (let index = 0; index < matchedRoutes.length; index++) {
      const route = matchedRoutes[index];
      const parentMatch = matches[index - 1];
      let preMatchSearch;
      let strictMatchSearch;
      let searchError;
      {
        const parentSearch = parentMatch?.search ?? next.search;
        const parentStrictSearch = parentMatch?._strictSearch ?? void 0;
        try {
          const strictSearch = validateSearch(route.options.validateSearch, { ...parentSearch }) ?? void 0;
          preMatchSearch = {
            ...parentSearch,
            ...strictSearch
          };
          strictMatchSearch = {
            ...parentStrictSearch,
            ...strictSearch
          };
          searchError = void 0;
        } catch (err) {
          let searchParamError = err;
          if (!(err instanceof SearchParamError)) searchParamError = new SearchParamError(err.message, { cause: err });
          if (opts?.throwOnError) throw searchParamError;
          preMatchSearch = parentSearch;
          strictMatchSearch = {};
          searchError = searchParamError;
        }
      }
      const loaderDeps = route.options.loaderDeps?.({ search: preMatchSearch }) ?? "";
      const loaderDepsHash = loaderDeps ? JSON.stringify(loaderDeps) : "";
      const { interpolatedPath, usedParams } = interpolatePath({
        path: route.fullPath,
        params: routeParams,
        decoder: this.pathParamsDecoder,
        server: this.isServer
      });
      const matchId = route.id + interpolatedPath + loaderDepsHash;
      const existingMatch = this.getMatch(matchId);
      const previousMatch = previousActiveMatchesByRouteId.get(route.id);
      const strictParams = existingMatch?._strictParams ?? usedParams;
      let paramsError = void 0;
      if (!existingMatch) try {
        extractStrictParams(route, strictParams);
      } catch (err) {
        if (isNotFound(err) || isRedirect(err)) paramsError = err;
        else paramsError = new PathParamError(err.message, { cause: err });
        if (opts?.throwOnError) throw paramsError;
      }
      Object.assign(routeParams, strictParams);
      const cause = previousMatch ? "stay" : "enter";
      let match;
      if (existingMatch) match = {
        ...existingMatch,
        cause,
        params: previousMatch?.params ?? routeParams,
        _strictParams: strictParams,
        search: previousMatch ? nullReplaceEqualDeep(previousMatch.search, preMatchSearch) : nullReplaceEqualDeep(existingMatch.search, preMatchSearch),
        _strictSearch: strictMatchSearch
      };
      else {
        const status = route.options.loader || route.options.beforeLoad || route.lazyFn || routeNeedsPreload(route) ? "pending" : "success";
        match = {
          id: matchId,
          ssr: void 0,
          index,
          routeId: route.id,
          params: previousMatch?.params ?? routeParams,
          _strictParams: strictParams,
          pathname: interpolatedPath,
          updatedAt: Date.now(),
          search: previousMatch ? nullReplaceEqualDeep(previousMatch.search, preMatchSearch) : preMatchSearch,
          _strictSearch: strictMatchSearch,
          searchError: void 0,
          status,
          isFetching: false,
          error: void 0,
          paramsError,
          __routeContext: void 0,
          _nonReactive: { loadPromise: createControlledPromise() },
          __beforeLoadContext: void 0,
          context: {},
          abortController: new AbortController(),
          fetchCount: 0,
          cause,
          loaderDeps: previousMatch ? replaceEqualDeep$1(previousMatch.loaderDeps, loaderDeps) : loaderDeps,
          invalid: false,
          preload: false,
          links: void 0,
          scripts: void 0,
          headScripts: void 0,
          meta: void 0,
          staticData: route.options.staticData || {},
          fullPath: route.fullPath
        };
      }
      if (!opts?.preload) match.globalNotFound = globalNotFoundRouteId === route.id;
      match.searchError = searchError;
      const parentContext = this.getParentContext(parentMatch);
      match.context = {
        ...parentContext,
        ...match.__routeContext,
        ...match.__beforeLoadContext
      };
      matches[index] = match;
    }
    for (let index = 0; index < matches.length; index++) {
      const match = matches[index];
      const route = this.looseRoutesById[match.routeId];
      const existingMatch = this.getMatch(match.id);
      const previousMatch = previousActiveMatchesByRouteId.get(match.routeId);
      match.params = previousMatch ? nullReplaceEqualDeep(previousMatch.params, routeParams) : routeParams;
      if (!existingMatch) {
        const parentMatch = matches[index - 1];
        const parentContext = this.getParentContext(parentMatch);
        if (route.options.context) {
          const contextFnContext = {
            deps: match.loaderDeps,
            params: match.params,
            context: parentContext ?? {},
            location: next,
            navigate: (opts2) => this.navigate({
              ...opts2,
              _fromLocation: next
            }),
            buildLocation: this.buildLocation,
            cause: match.cause,
            abortController: match.abortController,
            preload: !!match.preload,
            matches,
            routeId: route.id
          };
          match.__routeContext = route.options.context(contextFnContext) ?? void 0;
        }
        match.context = {
          ...parentContext,
          ...match.__routeContext,
          ...match.__beforeLoadContext
        };
      }
    }
    return matches;
  }
  /**
  * Lightweight route matching for buildLocation.
  * Only computes fullPath, accumulated search, and params - skipping expensive
  * operations like AbortController, ControlledPromise, loaderDeps, and full match objects.
  */
  matchRoutesLightweight(location2) {
    const { matchedRoutes, routeParams } = this.getMatchedRoutes(location2.pathname);
    const lastRoute = last(matchedRoutes);
    const accumulatedSearch = { ...location2.search };
    for (const route of matchedRoutes) try {
      Object.assign(accumulatedSearch, validateSearch(route.options.validateSearch, accumulatedSearch));
    } catch {
    }
    const lastStateMatchId = last(this.stores.matchesId.get());
    const lastStateMatch = lastStateMatchId && this.stores.matchStores.get(lastStateMatchId)?.get();
    const canReuseParams = lastStateMatch && lastStateMatch.routeId === lastRoute.id && lastStateMatch.pathname === location2.pathname;
    let params;
    if (canReuseParams) params = lastStateMatch.params;
    else {
      const strictParams = Object.assign(/* @__PURE__ */ Object.create(null), routeParams);
      for (const route of matchedRoutes) try {
        extractStrictParams(route, strictParams);
      } catch {
      }
      params = strictParams;
    }
    return {
      matchedRoutes,
      fullPath: lastRoute.fullPath,
      search: accumulatedSearch,
      params
    };
  }
};
var SearchParamError = class extends Error {
};
var PathParamError = class extends Error {
};
function getInitialRouterState(location2) {
  return {
    loadedAt: 0,
    isLoading: false,
    isTransitioning: false,
    status: "idle",
    resolvedLocation: void 0,
    location: location2,
    matches: [],
    statusCode: 200
  };
}
function validateSearch(validateSearch2, input) {
  if (validateSearch2 == null) return {};
  if ("~standard" in validateSearch2) {
    const result = validateSearch2["~standard"].validate(input);
    if (result instanceof Promise) throw new SearchParamError("Async validation not supported");
    if (result.issues) throw new SearchParamError(JSON.stringify(result.issues, void 0, 2), { cause: result });
    return result.value;
  }
  if ("parse" in validateSearch2) return validateSearch2.parse(input);
  if (typeof validateSearch2 === "function") return validateSearch2(input);
  return {};
}
function getMatchedRoutes({ pathname, routesById, processedTree }) {
  const routeParams = /* @__PURE__ */ Object.create(null);
  const trimmedPath = trimPathRight(pathname);
  let foundRoute = void 0;
  const match = findRouteMatch(trimmedPath, processedTree, true);
  if (match) {
    foundRoute = match.route;
    Object.assign(routeParams, match.rawParams);
  }
  return {
    matchedRoutes: match?.branch || [routesById["__root__"]],
    routeParams,
    foundRoute
  };
}
function applySearchMiddleware({ search, dest, destRoutes, _includeValidateSearch }) {
  return buildMiddlewareChain(destRoutes)(search, dest, _includeValidateSearch ?? false);
}
function buildMiddlewareChain(destRoutes) {
  const context = {
    dest: null,
    _includeValidateSearch: false,
    middlewares: []
  };
  for (const route of destRoutes) {
    if ("search" in route.options) {
      if (route.options.search?.middlewares) context.middlewares.push(...route.options.search.middlewares);
    } else if (route.options.preSearchFilters || route.options.postSearchFilters) {
      const legacyMiddleware = ({ search, next }) => {
        let nextSearch = search;
        if ("preSearchFilters" in route.options && route.options.preSearchFilters) nextSearch = route.options.preSearchFilters.reduce((prev, next2) => next2(prev), search);
        const result = next(nextSearch);
        if ("postSearchFilters" in route.options && route.options.postSearchFilters) return route.options.postSearchFilters.reduce((prev, next2) => next2(prev), result);
        return result;
      };
      context.middlewares.push(legacyMiddleware);
    }
    if (route.options.validateSearch) {
      const validate = ({ search, next }) => {
        const result = next(search);
        if (!context._includeValidateSearch) return result;
        try {
          return {
            ...result,
            ...validateSearch(route.options.validateSearch, result) ?? void 0
          };
        } catch {
          return result;
        }
      };
      context.middlewares.push(validate);
    }
  }
  const final = ({ search }) => {
    const dest = context.dest;
    if (!dest.search) return {};
    if (dest.search === true) return search;
    return functionalUpdate$1(dest.search, search);
  };
  context.middlewares.push(final);
  const applyNext = (index, currentSearch, middlewares) => {
    if (index >= middlewares.length) return currentSearch;
    const middleware = middlewares[index];
    const next = (newSearch) => {
      return applyNext(index + 1, newSearch, middlewares);
    };
    return middleware({
      search: currentSearch,
      next
    });
  };
  return function middleware(search, dest, _includeValidateSearch) {
    context.dest = dest;
    context._includeValidateSearch = _includeValidateSearch;
    return applyNext(0, search, context.middlewares);
  };
}
function findGlobalNotFoundRouteId(notFoundMode, routes) {
  if (notFoundMode !== "root") for (let i2 = routes.length - 1; i2 >= 0; i2--) {
    const route = routes[i2];
    if (route.children) return route.id;
  }
  return rootRouteId;
}
function extractStrictParams(route, accumulatedParams) {
  const parseParams = route.options.params?.parse ?? route.options.parseParams;
  if (parseParams) {
    const result = parseParams(accumulatedParams);
    if (result === false) throw new Error("Route params.parse returned false for a matched route");
    Object.assign(accumulatedParams, result);
  }
}
var BaseRoute = class {
  get to() {
    return this._to;
  }
  get id() {
    return this._id;
  }
  get path() {
    return this._path;
  }
  get fullPath() {
    return this._fullPath;
  }
  constructor(options) {
    this.init = (opts) => {
      this.originalIndex = opts.originalIndex;
      const options2 = this.options;
      const isRoot = !options2?.path && !options2?.id;
      this.parentRoute = this.options.getParentRoute?.();
      if (isRoot) this._path = rootRouteId;
      else if (!this.parentRoute) {
        invariant();
      }
      let path = isRoot ? rootRouteId : options2?.path;
      if (path && path !== "/") path = trimPathLeft(path);
      const customId = options2?.id || path;
      let id = isRoot ? rootRouteId : joinPaths([this.parentRoute.id === "__root__" ? "" : this.parentRoute.id, customId]);
      if (path === "__root__") path = "/";
      if (id !== "__root__") id = joinPaths(["/", id]);
      const fullPath = id === "__root__" ? "/" : joinPaths([this.parentRoute.fullPath, path]);
      this._path = path;
      this._id = id;
      this._fullPath = fullPath;
      this._to = trimPathRight(fullPath);
    };
    this.addChildren = (children) => {
      return this._addFileChildren(children);
    };
    this._addFileChildren = (children) => {
      if (Array.isArray(children)) this.children = children;
      if (typeof children === "object" && children !== null) this.children = Object.values(children);
      return this;
    };
    this._addFileTypes = () => {
      return this;
    };
    this.updateLoader = (options2) => {
      Object.assign(this.options, options2);
      return this;
    };
    this.update = (options2) => {
      Object.assign(this.options, options2);
      return this;
    };
    this.lazy = (lazyFn) => {
      this.lazyFn = lazyFn;
      return this;
    };
    this.redirect = (opts) => redirect({
      from: this.fullPath,
      ...opts
    });
    this.options = options || {};
    this.isRoot = !options?.getParentRoute;
    if (options?.id && options?.path) throw new Error(`Route cannot have both an 'id' and a 'path' option.`);
  }
};
var BaseRootRoute = class extends BaseRoute {
  constructor(options) {
    super(options);
  }
};
function useMatch(opts) {
  const router2 = useRouter();
  const nearestMatchId = reactExports.useContext(opts.from ? dummyMatchContext : matchContext);
  const key = opts.from ?? nearestMatchId;
  const matchStore = key ? opts.from ? router2.stores.getRouteMatchStore(key) : router2.stores.matchStores.get(key) : void 0;
  {
    const match = matchStore?.get();
    if ((opts.shouldThrow ?? true) && !match) {
      invariant();
    }
    if (match === void 0) return;
    return opts.select ? opts.select(match) : match;
  }
}
function useLoaderData(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    structuralSharing: opts.structuralSharing,
    select: (s2) => {
      return opts.select ? opts.select(s2.loaderData) : s2.loaderData;
    }
  });
}
function useLoaderDeps(opts) {
  const { select, ...rest } = opts;
  return useMatch({
    ...rest,
    select: (s2) => {
      return select ? select(s2.loaderDeps) : s2.loaderDeps;
    }
  });
}
function useParams(opts) {
  return useMatch({
    from: opts.from,
    shouldThrow: opts.shouldThrow,
    structuralSharing: opts.structuralSharing,
    strict: opts.strict,
    select: (match) => {
      const params = opts.strict === false ? match.params : match._strictParams;
      return opts.select ? opts.select(params) : params;
    }
  });
}
function useSearch(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    shouldThrow: opts.shouldThrow,
    structuralSharing: opts.structuralSharing,
    select: (match) => {
      return opts.select ? opts.select(match.search) : match.search;
    }
  });
}
function useNavigate(_defaultOpts) {
  const router2 = useRouter();
  return reactExports.useCallback((options) => {
    return router2.navigate({
      ...options,
      from: options.from ?? _defaultOpts?.from
    });
  }, [_defaultOpts?.from, router2]);
}
function useRouteContext(opts) {
  return useMatch({
    ...opts,
    select: (match) => opts.select ? opts.select(match.context) : match.context
  });
}
var reactDomExports = requireReactDom();
const ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(reactDomExports);
function useLinkProps(options, forwardedRef) {
  const router2 = useRouter();
  const innerRef = useForwardedRef(forwardedRef);
  const { activeProps, inactiveProps, activeOptions, to: to2, preload: userPreload, preloadDelay: userPreloadDelay, preloadIntentProximity: _preloadIntentProximity, hashScrollIntoView, replace, startTransition, resetScroll, viewTransition, children, target, disabled, style, className, onClick, onBlur, onFocus, onMouseEnter, onMouseLeave, onTouchStart, ignoreBlocker, params: _params, search: _search, hash: _hash, state: _state, mask: _mask, reloadDocument: _reloadDocument, unsafeRelative: _unsafeRelative, from: _from, _fromLocation, ...propsSafeToSpread } = options;
  {
    const safeInternal = isSafeInternal(to2);
    if (typeof to2 === "string" && !safeInternal && to2.indexOf(":") > -1) try {
      new URL(to2);
      if (isDangerousProtocol(to2, router2.protocolAllowlist)) {
        if (false) ;
        return {
          ...propsSafeToSpread,
          ref: innerRef,
          href: void 0,
          ...children && { children },
          ...target && { target },
          ...disabled && { disabled },
          ...style && { style },
          ...className && { className }
        };
      }
      return {
        ...propsSafeToSpread,
        ref: innerRef,
        href: to2,
        ...children && { children },
        ...target && { target },
        ...disabled && { disabled },
        ...style && { style },
        ...className && { className }
      };
    } catch {
    }
    const next2 = router2.buildLocation({
      ...options,
      from: options.from
    });
    const hrefOption2 = getHrefOption(next2.maskedLocation ? next2.maskedLocation.publicHref : next2.publicHref, next2.maskedLocation ? next2.maskedLocation.external : next2.external, router2.history, disabled);
    const externalLink2 = (() => {
      if (hrefOption2?.external) {
        if (isDangerousProtocol(hrefOption2.href, router2.protocolAllowlist)) {
          return;
        }
        return hrefOption2.href;
      }
      if (safeInternal) return void 0;
      if (typeof to2 === "string" && to2.indexOf(":") > -1) try {
        new URL(to2);
        if (isDangerousProtocol(to2, router2.protocolAllowlist)) {
          if (false) ;
          return;
        }
        return to2;
      } catch {
      }
    })();
    const isActive2 = (() => {
      if (externalLink2) return false;
      const currentLocation2 = router2.stores.location.get();
      const exact = activeOptions?.exact ?? false;
      if (exact) {
        if (!exactPathTest(currentLocation2.pathname, next2.pathname, router2.basepath)) return false;
      } else {
        const currentPathSplit = removeTrailingSlash(currentLocation2.pathname, router2.basepath);
        const nextPathSplit = removeTrailingSlash(next2.pathname, router2.basepath);
        if (!(currentPathSplit.startsWith(nextPathSplit) && (currentPathSplit.length === nextPathSplit.length || currentPathSplit[nextPathSplit.length] === "/"))) return false;
      }
      if (activeOptions?.includeSearch ?? true) {
        if (currentLocation2.search !== next2.search) {
          const currentSearchEmpty = !currentLocation2.search || typeof currentLocation2.search === "object" && !hasKeys(currentLocation2.search);
          const nextSearchEmpty = !next2.search || typeof next2.search === "object" && !hasKeys(next2.search);
          if (!(currentSearchEmpty && nextSearchEmpty)) {
            if (!deepEqual(currentLocation2.search, next2.search, {
              partial: !exact,
              ignoreUndefined: !activeOptions?.explicitUndefined
            })) return false;
          }
        }
      }
      if (activeOptions?.includeHash) return false;
      return true;
    })();
    if (externalLink2) return {
      ...propsSafeToSpread,
      ref: innerRef,
      href: externalLink2,
      ...children && { children },
      ...target && { target },
      ...disabled && { disabled },
      ...style && { style },
      ...className && { className }
    };
    const resolvedActiveProps2 = isActive2 ? functionalUpdate$1(activeProps, {}) ?? STATIC_ACTIVE_OBJECT : STATIC_EMPTY_OBJECT;
    const resolvedInactiveProps2 = isActive2 ? STATIC_EMPTY_OBJECT : functionalUpdate$1(inactiveProps, {}) ?? STATIC_EMPTY_OBJECT;
    const resolvedStyle2 = (() => {
      const baseStyle = style;
      const activeStyle = resolvedActiveProps2.style;
      const inactiveStyle = resolvedInactiveProps2.style;
      if (!baseStyle && !activeStyle && !inactiveStyle) return;
      if (baseStyle && !activeStyle && !inactiveStyle) return baseStyle;
      if (!baseStyle && activeStyle && !inactiveStyle) return activeStyle;
      if (!baseStyle && !activeStyle && inactiveStyle) return inactiveStyle;
      return {
        ...baseStyle,
        ...activeStyle,
        ...inactiveStyle
      };
    })();
    const resolvedClassName2 = (() => {
      const baseClassName = className;
      const activeClassName = resolvedActiveProps2.className;
      const inactiveClassName = resolvedInactiveProps2.className;
      if (!baseClassName && !activeClassName && !inactiveClassName) return "";
      let out = "";
      if (baseClassName) out = baseClassName;
      if (activeClassName) out = out ? `${out} ${activeClassName}` : activeClassName;
      if (inactiveClassName) out = out ? `${out} ${inactiveClassName}` : inactiveClassName;
      return out;
    })();
    return {
      ...propsSafeToSpread,
      ...resolvedActiveProps2,
      ...resolvedInactiveProps2,
      href: hrefOption2?.href,
      ref: innerRef,
      disabled: !!disabled,
      target,
      ...resolvedStyle2 && { style: resolvedStyle2 },
      ...resolvedClassName2 && { className: resolvedClassName2 },
      ...disabled && STATIC_DISABLED_PROPS,
      ...isActive2 && STATIC_ACTIVE_PROPS
    };
  }
}
var STATIC_EMPTY_OBJECT = {};
var STATIC_ACTIVE_OBJECT = { className: "active" };
var STATIC_DISABLED_PROPS = {
  role: "link",
  "aria-disabled": true
};
var STATIC_ACTIVE_PROPS = {
  "data-status": "active",
  "aria-current": "page"
};
function getHrefOption(publicHref, external, history, disabled) {
  if (disabled) return void 0;
  if (external) return {
    href: publicHref,
    external: true
  };
  return {
    href: history.createHref(publicHref) || "/",
    external: false
  };
}
function isSafeInternal(to2) {
  if (typeof to2 !== "string") return false;
  const zero = to2.charCodeAt(0);
  if (zero === 47) return to2.charCodeAt(1) !== 47;
  return zero === 46;
}
var Link = reactExports.forwardRef((props, ref) => {
  const { _asChild, ...rest } = props;
  const { type: _type, ...linkProps } = useLinkProps(rest, ref);
  const children = typeof rest.children === "function" ? rest.children({ isActive: linkProps["data-status"] === "active" }) : rest.children;
  if (!_asChild) {
    const { disabled: _2, ...rest2 } = linkProps;
    return reactExports.createElement("a", rest2, children);
  }
  return reactExports.createElement(_asChild, linkProps, children);
});
var Route$w = class Route extends BaseRoute {
  /**
  * @deprecated Use the `createRoute` function instead.
  */
  constructor(options) {
    super(options);
    this.useMatch = (opts) => {
      return useMatch({
        select: opts?.select,
        from: this.id,
        structuralSharing: opts?.structuralSharing
      });
    };
    this.useRouteContext = (opts) => {
      return useRouteContext({
        ...opts,
        from: this.id
      });
    };
    this.useSearch = (opts) => {
      return useSearch({
        select: opts?.select,
        structuralSharing: opts?.structuralSharing,
        from: this.id
      });
    };
    this.useParams = (opts) => {
      return useParams({
        select: opts?.select,
        structuralSharing: opts?.structuralSharing,
        from: this.id
      });
    };
    this.useLoaderDeps = (opts) => {
      return useLoaderDeps({
        ...opts,
        from: this.id
      });
    };
    this.useLoaderData = (opts) => {
      return useLoaderData({
        ...opts,
        from: this.id
      });
    };
    this.useNavigate = () => {
      return useNavigate({ from: this.fullPath });
    };
    this.Link = React.forwardRef((props, ref) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
        ref,
        from: this.fullPath,
        ...props
      });
    });
  }
};
function createRoute(options) {
  return new Route$w(options);
}
function createRootRouteWithContext() {
  return (options) => {
    return createRootRoute(options);
  };
}
var RootRoute = class extends BaseRootRoute {
  /**
  * @deprecated `RootRoute` is now an internal implementation detail. Use `createRootRoute()` instead.
  */
  constructor(options) {
    super(options);
    this.useMatch = (opts) => {
      return useMatch({
        select: opts?.select,
        from: this.id,
        structuralSharing: opts?.structuralSharing
      });
    };
    this.useRouteContext = (opts) => {
      return useRouteContext({
        ...opts,
        from: this.id
      });
    };
    this.useSearch = (opts) => {
      return useSearch({
        select: opts?.select,
        structuralSharing: opts?.structuralSharing,
        from: this.id
      });
    };
    this.useParams = (opts) => {
      return useParams({
        select: opts?.select,
        structuralSharing: opts?.structuralSharing,
        from: this.id
      });
    };
    this.useLoaderDeps = (opts) => {
      return useLoaderDeps({
        ...opts,
        from: this.id
      });
    };
    this.useLoaderData = (opts) => {
      return useLoaderData({
        ...opts,
        from: this.id
      });
    };
    this.useNavigate = () => {
      return useNavigate({ from: this.fullPath });
    };
    this.Link = React.forwardRef((props, ref) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
        ref,
        from: this.fullPath,
        ...props
      });
    });
  }
};
function createRootRoute(options) {
  return new RootRoute(options);
}
function createFileRoute(path) {
  return new FileRoute(path, { silent: true }).createRoute;
}
var FileRoute = class {
  constructor(path, _opts) {
    this.path = path;
    this.createRoute = (options) => {
      const route = createRoute(options);
      route.isRoot = false;
      return route;
    };
    this.silent = _opts?.silent;
  }
};
function lazyRouteComponent(importer, exportName) {
  let loadPromise;
  let comp;
  let error;
  let reload;
  const load = () => {
    if (!loadPromise) loadPromise = importer().then((res) => {
      loadPromise = void 0;
      comp = res[exportName];
    }).catch((err) => {
      error = err;
      if (isModuleNotFoundError(error)) {
        if (error instanceof Error && typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
          const storageKey = `tanstack_router_reload:${error.message}`;
          if (!sessionStorage.getItem(storageKey)) {
            sessionStorage.setItem(storageKey, "1");
            reload = true;
          }
        }
      }
    });
    return loadPromise;
  };
  const lazyComp = function Lazy(props) {
    if (reload) {
      window.location.reload();
      throw new Promise(() => {
      });
    }
    if (error) throw error;
    if (!comp) if (reactUse) reactUse(load());
    else throw load();
    return reactExports.createElement(comp, props);
  };
  lazyComp.preload = load;
  return lazyComp;
}
var getStoreFactory = (opts) => {
  return {
    createMutableStore: createNonReactiveMutableStore,
    createReadonlyStore: createNonReactiveReadonlyStore,
    batch: (fn2) => fn2()
  };
};
var createRouter = (options) => {
  return new Router(options);
};
var Router = class extends RouterCore {
  constructor(options) {
    super(options, getStoreFactory);
  }
};
function useRouterState(opts) {
  const contextRouter = useRouter({ warn: opts?.router === void 0 });
  const router2 = opts?.router || contextRouter;
  {
    const state = router2.stores.__store.get();
    return opts?.select ? opts.select(state) : state;
  }
}
function Asset(asset) {
  const { attrs, children, nonce } = asset;
  switch (asset.tag) {
    case "title":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("title", {
        ...attrs,
        suppressHydrationWarning: true,
        children
      });
    case "meta":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("meta", {
        ...attrs,
        suppressHydrationWarning: true
      });
    case "link":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("link", {
        ...attrs,
        precedence: attrs?.precedence ?? (attrs?.rel === "stylesheet" ? "default" : void 0),
        nonce,
        suppressHydrationWarning: true
      });
    case "style":
      if (asset.inlineCss && false) ;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("style", {
        ...attrs,
        dangerouslySetInnerHTML: { __html: children },
        nonce
      });
    case "script":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Script, {
        attrs,
        children
      });
    default:
      return null;
  }
}
function Script({ attrs, children }) {
  useRouter();
  useHydrated();
  const dataScript = typeof attrs?.type === "string" && attrs.type !== "" && attrs.type !== "text/javascript" && attrs.type !== "module";
  reactExports.useEffect(() => {
    if (dataScript) return;
    if (attrs?.src) {
      const normSrc = (() => {
        try {
          const base = document.baseURI || window.location.href;
          return new URL(attrs.src, base).href;
        } catch {
          return attrs.src;
        }
      })();
      if (Array.from(document.querySelectorAll("script[src]")).find((el) => el.src === normSrc)) return;
      const script = document.createElement("script");
      for (const [key, value] of Object.entries(attrs)) if (key !== "suppressHydrationWarning" && value !== void 0 && value !== false) script.setAttribute(key, typeof value === "boolean" ? "" : String(value));
      document.head.appendChild(script);
      return () => {
        if (script.parentNode) script.parentNode.removeChild(script);
      };
    }
    if (typeof children === "string") {
      const typeAttr = typeof attrs?.type === "string" ? attrs.type : "text/javascript";
      const nonceAttr = typeof attrs?.nonce === "string" ? attrs.nonce : void 0;
      if (Array.from(document.querySelectorAll("script:not([src])")).find((el) => {
        if (!(el instanceof HTMLScriptElement)) return false;
        const sType = el.getAttribute("type") ?? "text/javascript";
        const sNonce = el.getAttribute("nonce") ?? void 0;
        return el.textContent === children && sType === typeAttr && sNonce === nonceAttr;
      })) return;
      const script = document.createElement("script");
      script.textContent = children;
      if (attrs) {
        for (const [key, value] of Object.entries(attrs)) if (key !== "suppressHydrationWarning" && value !== void 0 && value !== false) script.setAttribute(key, typeof value === "boolean" ? "" : String(value));
      }
      document.head.appendChild(script);
      return () => {
        if (script.parentNode) script.parentNode.removeChild(script);
      };
    }
  }, [
    attrs,
    children,
    dataScript
  ]);
  {
    if (attrs?.src) return /* @__PURE__ */ jsxRuntimeExports.jsx("script", {
      ...attrs,
      suppressHydrationWarning: true
    });
    if (typeof children === "string") return /* @__PURE__ */ jsxRuntimeExports.jsx("script", {
      ...attrs,
      dangerouslySetInnerHTML: { __html: children },
      suppressHydrationWarning: true
    });
    return null;
  }
}
function buildTagsFromMatches(router2, nonce, matches, assetCrossOrigin) {
  const routeMeta = matches.map((match) => match.meta).filter(Boolean);
  const resultMeta = [];
  const metaByAttribute = {};
  let title;
  for (let i2 = routeMeta.length - 1; i2 >= 0; i2--) {
    const metas = routeMeta[i2];
    for (let j2 = metas.length - 1; j2 >= 0; j2--) {
      const m2 = metas[j2];
      if (!m2) continue;
      if (m2.title) {
        if (!title) title = {
          tag: "title",
          children: m2.title
        };
      } else if ("script:ld+json" in m2) try {
        const json = JSON.stringify(m2["script:ld+json"]);
        resultMeta.push({
          tag: "script",
          attrs: { type: "application/ld+json" },
          children: escapeHtml(json)
        });
      } catch {
      }
      else {
        const attribute = m2.name ?? m2.property;
        if (attribute) if (metaByAttribute[attribute]) continue;
        else metaByAttribute[attribute] = true;
        resultMeta.push({
          tag: "meta",
          attrs: {
            ...m2,
            nonce
          }
        });
      }
    }
  }
  if (title) resultMeta.push(title);
  if (nonce) resultMeta.push({
    tag: "meta",
    attrs: {
      property: "csp-nonce",
      content: nonce
    }
  });
  resultMeta.reverse();
  const constructedLinks = matches.map((match) => match.links).filter(Boolean).flat(1).map((link) => ({
    tag: "link",
    attrs: {
      ...link,
      nonce
    }
  }));
  const manifest = router2.ssr?.manifest;
  const assetLinks = matches.map((match) => manifest?.routes[match.routeId]?.assets ?? []).filter(Boolean).flat(1).flatMap((asset) => {
    if (asset.tag === "link") {
      if (isInlinableStylesheet(manifest, asset)) return [];
      return [{
        tag: "link",
        attrs: {
          ...asset.attrs,
          crossOrigin: getAssetCrossOrigin(assetCrossOrigin, "stylesheet") ?? asset.attrs?.crossOrigin,
          suppressHydrationWarning: true,
          nonce
        }
      }];
    }
    if (asset.tag === "style") return [{
      tag: "style",
      attrs: {
        ...asset.attrs,
        nonce
      },
      children: asset.children,
      ...asset.inlineCss ? { inlineCss: true } : {}
    }];
    return [];
  });
  const preloadLinks = [];
  matches.map((match) => router2.looseRoutesById[match.routeId]).forEach((route) => router2.ssr?.manifest?.routes[route.id]?.preloads?.filter(Boolean).forEach((preload) => {
    const preloadLink = resolveManifestAssetLink(preload);
    preloadLinks.push({
      tag: "link",
      attrs: {
        rel: "modulepreload",
        href: preloadLink.href,
        crossOrigin: getAssetCrossOrigin(assetCrossOrigin, "modulepreload") ?? preloadLink.crossOrigin,
        nonce
      }
    });
  }));
  const styles = matches.map((match) => match.styles).flat(1).filter(Boolean).map(({ children, ...attrs }) => ({
    tag: "style",
    attrs: {
      ...attrs,
      nonce
    },
    children
  }));
  const headScripts = matches.map((match) => match.headScripts).flat(1).filter(Boolean).map(({ children, ...script }) => ({
    tag: "script",
    attrs: {
      ...script,
      nonce
    },
    children
  }));
  return uniqBy([
    ...resultMeta,
    ...preloadLinks,
    ...constructedLinks,
    ...assetLinks,
    ...styles,
    ...headScripts
  ], (d2) => JSON.stringify(d2));
}
var useTags = (assetCrossOrigin) => {
  const router2 = useRouter();
  const nonce = router2.options.ssr?.nonce;
  return buildTagsFromMatches(router2, nonce, router2.stores.matches.get(), assetCrossOrigin);
};
function uniqBy(arr, fn2) {
  const seen = /* @__PURE__ */ new Set();
  return arr.filter((item) => {
    const key = fn2(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function HeadContent(props) {
  const tags = useTags(props.assetCrossOrigin);
  const nonce = useRouter().options.ssr?.nonce;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: tags.map((tag) => /* @__PURE__ */ reactExports.createElement(Asset, {
    ...tag,
    key: `tsr-meta-${JSON.stringify(tag)}`,
    nonce
  })) });
}
var Scripts = () => {
  const router2 = useRouter();
  const nonce = router2.options.ssr?.nonce;
  const getAssetScripts = (matches) => {
    const assetScripts = [];
    const manifest = router2.ssr?.manifest;
    if (!manifest) return [];
    matches.map((match) => router2.looseRoutesById[match.routeId]).forEach((route) => manifest.routes[route.id]?.assets?.filter((d2) => d2.tag === "script").forEach((asset) => {
      assetScripts.push({
        tag: "script",
        attrs: {
          ...asset.attrs,
          nonce
        },
        children: asset.children
      });
    }));
    return assetScripts;
  };
  const getScripts = (matches) => matches.map((match) => match.scripts).flat(1).filter(Boolean).map(({ children, ...script }) => ({
    tag: "script",
    attrs: {
      ...script,
      suppressHydrationWarning: true,
      nonce
    },
    children
  }));
  {
    const activeMatches = router2.stores.matches.get();
    const assetScripts = getAssetScripts(activeMatches);
    return renderScripts(router2, getScripts(activeMatches), assetScripts);
  }
};
function renderScripts(router2, scripts, assetScripts) {
  let serverBufferedScript = void 0;
  if (router2.serverSsr) serverBufferedScript = router2.serverSsr.takeBufferedScripts();
  const allScripts = [...scripts, ...assetScripts];
  if (serverBufferedScript) allScripts.unshift(serverBufferedScript);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: allScripts.map((asset, i2) => /* @__PURE__ */ reactExports.createElement(Asset, {
    ...asset,
    key: `tsr-scripts-${asset.tag}-${i2}`
  })) });
}
var Subscribable = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Set();
    this.subscribe = this.subscribe.bind(this);
  }
  subscribe(listener) {
    this.listeners.add(listener);
    this.onSubscribe();
    return () => {
      this.listeners.delete(listener);
      this.onUnsubscribe();
    };
  }
  hasListeners() {
    return this.listeners.size > 0;
  }
  onSubscribe() {
  }
  onUnsubscribe() {
  }
};
var FocusManager = class extends Subscribable {
  #focused;
  #cleanup;
  #setup;
  constructor() {
    super();
    this.#setup = (onFocus) => {
      if (typeof window !== "undefined" && window.addEventListener) {
        const listener = () => onFocus();
        window.addEventListener("visibilitychange", listener, false);
        return () => {
          window.removeEventListener("visibilitychange", listener);
        };
      }
      return;
    };
  }
  onSubscribe() {
    if (!this.#cleanup) {
      this.setEventListener(this.#setup);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.#cleanup?.();
      this.#cleanup = void 0;
    }
  }
  setEventListener(setup) {
    this.#setup = setup;
    this.#cleanup?.();
    this.#cleanup = setup((focused) => {
      if (typeof focused === "boolean") {
        this.setFocused(focused);
      } else {
        this.onFocus();
      }
    });
  }
  setFocused(focused) {
    const changed = this.#focused !== focused;
    if (changed) {
      this.#focused = focused;
      this.onFocus();
    }
  }
  onFocus() {
    const isFocused = this.isFocused();
    this.listeners.forEach((listener) => {
      listener(isFocused);
    });
  }
  isFocused() {
    if (typeof this.#focused === "boolean") {
      return this.#focused;
    }
    return globalThis.document?.visibilityState !== "hidden";
  }
};
var focusManager = new FocusManager();
var defaultTimeoutProvider = {
  // We need the wrapper function syntax below instead of direct references to
  // global setTimeout etc.
  //
  // BAD: `setTimeout: setTimeout`
  // GOOD: `setTimeout: (cb, delay) => setTimeout(cb, delay)`
  //
  // If we use direct references here, then anything that wants to spy on or
  // replace the global setTimeout (like tests) won't work since we'll already
  // have a hard reference to the original implementation at the time when this
  // file was imported.
  setTimeout: (callback, delay) => setTimeout(callback, delay),
  clearTimeout: (timeoutId) => clearTimeout(timeoutId),
  setInterval: (callback, delay) => setInterval(callback, delay),
  clearInterval: (intervalId) => clearInterval(intervalId)
};
var TimeoutManager = class {
  // We cannot have TimeoutManager<T> as we must instantiate it with a concrete
  // type at app boot; and if we leave that type, then any new timer provider
  // would need to support the default provider's concrete timer ID, which is
  // infeasible across environments.
  //
  // We settle for type safety for the TimeoutProvider type, and accept that
  // this class is unsafe internally to allow for extension.
  #provider = defaultTimeoutProvider;
  #providerCalled = false;
  setTimeoutProvider(provider) {
    this.#provider = provider;
  }
  setTimeout(callback, delay) {
    return this.#provider.setTimeout(callback, delay);
  }
  clearTimeout(timeoutId) {
    this.#provider.clearTimeout(timeoutId);
  }
  setInterval(callback, delay) {
    return this.#provider.setInterval(callback, delay);
  }
  clearInterval(intervalId) {
    this.#provider.clearInterval(intervalId);
  }
};
var timeoutManager = new TimeoutManager();
function systemSetTimeoutZero(callback) {
  setTimeout(callback, 0);
}
var isServer = typeof window === "undefined" || "Deno" in globalThis;
function noop() {
}
function functionalUpdate(updater, input) {
  return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
  return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
  return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function resolveStaleTime(staleTime, query) {
  return typeof staleTime === "function" ? staleTime(query) : staleTime;
}
function resolveQueryBoolean(option, query) {
  return typeof option === "function" ? option(query) : option;
}
function matchQuery(filters, query) {
  const {
    type = "all",
    exact,
    fetchStatus,
    predicate,
    queryKey,
    stale
  } = filters;
  if (queryKey) {
    if (exact) {
      if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
        return false;
      }
    } else if (!partialMatchKey(query.queryKey, queryKey)) {
      return false;
    }
  }
  if (type !== "all") {
    const isActive = query.isActive();
    if (type === "active" && !isActive) {
      return false;
    }
    if (type === "inactive" && isActive) {
      return false;
    }
  }
  if (typeof stale === "boolean" && query.isStale() !== stale) {
    return false;
  }
  if (fetchStatus && fetchStatus !== query.state.fetchStatus) {
    return false;
  }
  if (predicate && !predicate(query)) {
    return false;
  }
  return true;
}
function matchMutation(filters, mutation) {
  const { exact, status, predicate, mutationKey } = filters;
  if (mutationKey) {
    if (!mutation.options.mutationKey) {
      return false;
    }
    if (exact) {
      if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) {
        return false;
      }
    } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
      return false;
    }
  }
  if (status && mutation.state.status !== status) {
    return false;
  }
  if (predicate && !predicate(mutation)) {
    return false;
  }
  return true;
}
function hashQueryKeyByOptions(queryKey, options) {
  const hashFn = options?.queryKeyHashFn || hashKey;
  return hashFn(queryKey);
}
function hashKey(queryKey) {
  return JSON.stringify(
    queryKey,
    (_2, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
      result[key] = val[key];
      return result;
    }, {}) : val
  );
}
function partialMatchKey(a2, b2) {
  if (a2 === b2) {
    return true;
  }
  if (typeof a2 !== typeof b2) {
    return false;
  }
  if (a2 && b2 && typeof a2 === "object" && typeof b2 === "object") {
    return Object.keys(b2).every((key) => partialMatchKey(a2[key], b2[key]));
  }
  return false;
}
var hasOwn = Object.prototype.hasOwnProperty;
function replaceEqualDeep(a2, b2, depth = 0) {
  if (a2 === b2) {
    return a2;
  }
  if (depth > 500) return b2;
  const array = isPlainArray(a2) && isPlainArray(b2);
  if (!array && !(isPlainObject(a2) && isPlainObject(b2))) return b2;
  const aItems = array ? a2 : Object.keys(a2);
  const aSize = aItems.length;
  const bItems = array ? b2 : Object.keys(b2);
  const bSize = bItems.length;
  const copy = array ? new Array(bSize) : {};
  let equalItems = 0;
  for (let i2 = 0; i2 < bSize; i2++) {
    const key = array ? i2 : bItems[i2];
    const aItem = a2[key];
    const bItem = b2[key];
    if (aItem === bItem) {
      copy[key] = aItem;
      if (array ? i2 < aSize : hasOwn.call(a2, key)) equalItems++;
      continue;
    }
    if (aItem === null || bItem === null || typeof aItem !== "object" || typeof bItem !== "object") {
      copy[key] = bItem;
      continue;
    }
    const v2 = replaceEqualDeep(aItem, bItem, depth + 1);
    copy[key] = v2;
    if (v2 === aItem) equalItems++;
  }
  return aSize === bSize && equalItems === aSize ? a2 : copy;
}
function shallowEqualObjects(a2, b2) {
  if (!b2 || Object.keys(a2).length !== Object.keys(b2).length) {
    return false;
  }
  for (const key in a2) {
    if (a2[key] !== b2[key]) {
      return false;
    }
  }
  return true;
}
function isPlainArray(value) {
  return Array.isArray(value) && value.length === Object.keys(value).length;
}
function isPlainObject(o2) {
  if (!hasObjectPrototype(o2)) {
    return false;
  }
  const ctor = o2.constructor;
  if (ctor === void 0) {
    return true;
  }
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  if (Object.getPrototypeOf(o2) !== Object.prototype) {
    return false;
  }
  return true;
}
function hasObjectPrototype(o2) {
  return Object.prototype.toString.call(o2) === "[object Object]";
}
function sleep(timeout) {
  return new Promise((resolve) => {
    timeoutManager.setTimeout(resolve, timeout);
  });
}
function replaceData(prevData, data, options) {
  if (typeof options.structuralSharing === "function") {
    return options.structuralSharing(prevData, data);
  } else if (options.structuralSharing !== false) {
    return replaceEqualDeep(prevData, data);
  }
  return data;
}
function addToEnd(items, item, max = 0) {
  const newItems = [...items, item];
  return max && newItems.length > max ? newItems.slice(1) : newItems;
}
function addToStart(items, item, max = 0) {
  const newItems = [item, ...items];
  return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
}
var skipToken = /* @__PURE__ */ Symbol();
function ensureQueryFn(options, fetchOptions) {
  if (!options.queryFn && fetchOptions?.initialPromise) {
    return () => fetchOptions.initialPromise;
  }
  if (!options.queryFn || options.queryFn === skipToken) {
    return () => Promise.reject(new Error(`Missing queryFn: '${options.queryHash}'`));
  }
  return options.queryFn;
}
function shouldThrowError(throwOnError, params) {
  if (typeof throwOnError === "function") {
    return throwOnError(...params);
  }
  return !!throwOnError;
}
function addConsumeAwareSignal(object, getSignal, onCancelled) {
  let consumed = false;
  let signal;
  Object.defineProperty(object, "signal", {
    enumerable: true,
    get: () => {
      signal ??= getSignal();
      if (consumed) {
        return signal;
      }
      consumed = true;
      if (signal.aborted) {
        onCancelled();
      } else {
        signal.addEventListener("abort", onCancelled, { once: true });
      }
      return signal;
    }
  });
  return object;
}
var environmentManager = /* @__PURE__ */ (() => {
  let isServerFn = () => isServer;
  return {
    /**
     * Returns whether the current runtime should be treated as a server environment.
     */
    isServer() {
      return isServerFn();
    },
    /**
     * Overrides the server check globally.
     */
    setIsServer(isServerValue) {
      isServerFn = isServerValue;
    }
  };
})();
function pendingThenable() {
  let resolve;
  let reject;
  const thenable = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  thenable.status = "pending";
  thenable.catch(() => {
  });
  function finalize(data) {
    Object.assign(thenable, data);
    delete thenable.resolve;
    delete thenable.reject;
  }
  thenable.resolve = (value) => {
    finalize({
      status: "fulfilled",
      value
    });
    resolve(value);
  };
  thenable.reject = (reason) => {
    finalize({
      status: "rejected",
      reason
    });
    reject(reason);
  };
  return thenable;
}
var defaultScheduler = systemSetTimeoutZero;
function createNotifyManager() {
  let queue = [];
  let transactions = 0;
  let notifyFn = (callback) => {
    callback();
  };
  let batchNotifyFn = (callback) => {
    callback();
  };
  let scheduleFn = defaultScheduler;
  const schedule = (callback) => {
    if (transactions) {
      queue.push(callback);
    } else {
      scheduleFn(() => {
        notifyFn(callback);
      });
    }
  };
  const flush = () => {
    const originalQueue = queue;
    queue = [];
    if (originalQueue.length) {
      scheduleFn(() => {
        batchNotifyFn(() => {
          originalQueue.forEach((callback) => {
            notifyFn(callback);
          });
        });
      });
    }
  };
  return {
    batch: (callback) => {
      let result;
      transactions++;
      try {
        result = callback();
      } finally {
        transactions--;
        if (!transactions) {
          flush();
        }
      }
      return result;
    },
    /**
     * All calls to the wrapped function will be batched.
     */
    batchCalls: (callback) => {
      return (...args) => {
        schedule(() => {
          callback(...args);
        });
      };
    },
    schedule,
    /**
     * Use this method to set a custom notify function.
     * This can be used to for example wrap notifications with `React.act` while running tests.
     */
    setNotifyFunction: (fn2) => {
      notifyFn = fn2;
    },
    /**
     * Use this method to set a custom function to batch notifications together into a single tick.
     * By default React Query will use the batch function provided by ReactDOM or React Native.
     */
    setBatchNotifyFunction: (fn2) => {
      batchNotifyFn = fn2;
    },
    setScheduler: (fn2) => {
      scheduleFn = fn2;
    }
  };
}
var notifyManager = createNotifyManager();
var OnlineManager = class extends Subscribable {
  #online = true;
  #cleanup;
  #setup;
  constructor() {
    super();
    this.#setup = (onOnline) => {
      if (typeof window !== "undefined" && window.addEventListener) {
        const onlineListener = () => onOnline(true);
        const offlineListener = () => onOnline(false);
        window.addEventListener("online", onlineListener, false);
        window.addEventListener("offline", offlineListener, false);
        return () => {
          window.removeEventListener("online", onlineListener);
          window.removeEventListener("offline", offlineListener);
        };
      }
      return;
    };
  }
  onSubscribe() {
    if (!this.#cleanup) {
      this.setEventListener(this.#setup);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.#cleanup?.();
      this.#cleanup = void 0;
    }
  }
  setEventListener(setup) {
    this.#setup = setup;
    this.#cleanup?.();
    this.#cleanup = setup(this.setOnline.bind(this));
  }
  setOnline(online) {
    const changed = this.#online !== online;
    if (changed) {
      this.#online = online;
      this.listeners.forEach((listener) => {
        listener(online);
      });
    }
  }
  isOnline() {
    return this.#online;
  }
};
var onlineManager = new OnlineManager();
function defaultRetryDelay(failureCount) {
  return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
  return (networkMode ?? "online") === "online" ? onlineManager.isOnline() : true;
}
var CancelledError = class extends Error {
  constructor(options) {
    super("CancelledError");
    this.revert = options?.revert;
    this.silent = options?.silent;
  }
};
function createRetryer(config) {
  let isRetryCancelled = false;
  let failureCount = 0;
  let continueFn;
  const thenable = pendingThenable();
  const isResolved = () => thenable.status !== "pending";
  const cancel = (cancelOptions) => {
    if (!isResolved()) {
      const error = new CancelledError(cancelOptions);
      reject(error);
      config.onCancel?.(error);
    }
  };
  const cancelRetry = () => {
    isRetryCancelled = true;
  };
  const continueRetry = () => {
    isRetryCancelled = false;
  };
  const canContinue = () => focusManager.isFocused() && (config.networkMode === "always" || onlineManager.isOnline()) && config.canRun();
  const canStart = () => canFetch(config.networkMode) && config.canRun();
  const resolve = (value) => {
    if (!isResolved()) {
      continueFn?.();
      thenable.resolve(value);
    }
  };
  const reject = (value) => {
    if (!isResolved()) {
      continueFn?.();
      thenable.reject(value);
    }
  };
  const pause = () => {
    return new Promise((continueResolve) => {
      continueFn = (value) => {
        if (isResolved() || canContinue()) {
          continueResolve(value);
        }
      };
      config.onPause?.();
    }).then(() => {
      continueFn = void 0;
      if (!isResolved()) {
        config.onContinue?.();
      }
    });
  };
  const run = () => {
    if (isResolved()) {
      return;
    }
    let promiseOrValue;
    const initialPromise = failureCount === 0 ? config.initialPromise : void 0;
    try {
      promiseOrValue = initialPromise ?? config.fn();
    } catch (error) {
      promiseOrValue = Promise.reject(error);
    }
    Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
      if (isResolved()) {
        return;
      }
      const retry = config.retry ?? (environmentManager.isServer() ? 0 : 3);
      const retryDelay = config.retryDelay ?? defaultRetryDelay;
      const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
      const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
      if (isRetryCancelled || !shouldRetry) {
        reject(error);
        return;
      }
      failureCount++;
      config.onFail?.(failureCount, error);
      sleep(delay).then(() => {
        return canContinue() ? void 0 : pause();
      }).then(() => {
        if (isRetryCancelled) {
          reject(error);
        } else {
          run();
        }
      });
    });
  };
  return {
    promise: thenable,
    status: () => thenable.status,
    cancel,
    continue: () => {
      continueFn?.();
      return thenable;
    },
    cancelRetry,
    continueRetry,
    canStart,
    start: () => {
      if (canStart()) {
        run();
      } else {
        pause().then(run);
      }
      return thenable;
    }
  };
}
var Removable = class {
  #gcTimeout;
  destroy() {
    this.clearGcTimeout();
  }
  scheduleGc() {
    this.clearGcTimeout();
    if (isValidTimeout(this.gcTime)) {
      this.#gcTimeout = timeoutManager.setTimeout(() => {
        this.optionalRemove();
      }, this.gcTime);
    }
  }
  updateGcTime(newGcTime) {
    this.gcTime = Math.max(
      this.gcTime || 0,
      newGcTime ?? (environmentManager.isServer() ? Infinity : 5 * 60 * 1e3)
    );
  }
  clearGcTimeout() {
    if (this.#gcTimeout !== void 0) {
      timeoutManager.clearTimeout(this.#gcTimeout);
      this.#gcTimeout = void 0;
    }
  }
};
function infiniteQueryBehavior(pages) {
  return {
    onFetch: (context, query) => {
      const options = context.options;
      const direction = context.fetchOptions?.meta?.fetchMore?.direction;
      const oldPages = context.state.data?.pages || [];
      const oldPageParams = context.state.data?.pageParams || [];
      let result = { pages: [], pageParams: [] };
      let currentPage = 0;
      const fetchFn = async () => {
        let cancelled = false;
        const addSignalProperty = (object) => {
          addConsumeAwareSignal(
            object,
            () => context.signal,
            () => cancelled = true
          );
        };
        const queryFn = ensureQueryFn(context.options, context.fetchOptions);
        const fetchPage = async (data, param, previous) => {
          if (cancelled) {
            return Promise.reject(context.signal.reason);
          }
          if (param == null && data.pages.length) {
            return Promise.resolve(data);
          }
          const createQueryFnContext = () => {
            const queryFnContext2 = {
              client: context.client,
              queryKey: context.queryKey,
              pageParam: param,
              direction: previous ? "backward" : "forward",
              meta: context.options.meta
            };
            addSignalProperty(queryFnContext2);
            return queryFnContext2;
          };
          const queryFnContext = createQueryFnContext();
          const page = await queryFn(queryFnContext);
          const { maxPages } = context.options;
          const addTo = previous ? addToStart : addToEnd;
          return {
            pages: addTo(data.pages, page, maxPages),
            pageParams: addTo(data.pageParams, param, maxPages)
          };
        };
        if (direction && oldPages.length) {
          const previous = direction === "backward";
          const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
          const oldData = {
            pages: oldPages,
            pageParams: oldPageParams
          };
          const param = pageParamFn(options, oldData);
          result = await fetchPage(oldData, param, previous);
        } else {
          const remainingPages = pages ?? oldPages.length;
          do {
            const param = currentPage === 0 ? oldPageParams[0] ?? options.initialPageParam : getNextPageParam(options, result);
            if (currentPage > 0 && param == null) {
              break;
            }
            result = await fetchPage(result, param);
            currentPage++;
          } while (currentPage < remainingPages);
        }
        return result;
      };
      if (context.options.persister) {
        context.fetchFn = () => {
          return context.options.persister?.(
            fetchFn,
            {
              client: context.client,
              queryKey: context.queryKey,
              meta: context.options.meta,
              signal: context.signal
            },
            query
          );
        };
      } else {
        context.fetchFn = fetchFn;
      }
    }
  };
}
function getNextPageParam(options, { pages, pageParams }) {
  const lastIndex = pages.length - 1;
  return pages.length > 0 ? options.getNextPageParam(
    pages[lastIndex],
    pages,
    pageParams[lastIndex],
    pageParams
  ) : void 0;
}
function getPreviousPageParam(options, { pages, pageParams }) {
  return pages.length > 0 ? options.getPreviousPageParam?.(pages[0], pages, pageParams[0], pageParams) : void 0;
}
var Query = class extends Removable {
  #queryType;
  #initialState;
  #revertState;
  #cache;
  #client;
  #retryer;
  #defaultOptions;
  #abortSignalConsumed;
  constructor(config) {
    super();
    this.#abortSignalConsumed = false;
    this.#defaultOptions = config.defaultOptions;
    this.setOptions(config.options);
    this.observers = [];
    this.#client = config.client;
    this.#cache = this.#client.getQueryCache();
    this.queryKey = config.queryKey;
    this.queryHash = config.queryHash;
    this.#initialState = getDefaultState$1(this.options);
    this.state = config.state ?? this.#initialState;
    this.scheduleGc();
  }
  get meta() {
    return this.options.meta;
  }
  get queryType() {
    return this.#queryType;
  }
  get promise() {
    return this.#retryer?.promise;
  }
  setOptions(options) {
    this.options = { ...this.#defaultOptions, ...options };
    if (options?._type) {
      this.#queryType = options._type;
    }
    this.updateGcTime(this.options.gcTime);
    if (this.state && this.state.data === void 0) {
      const defaultState = getDefaultState$1(this.options);
      if (defaultState.data !== void 0) {
        this.setState(
          successState(defaultState.data, defaultState.dataUpdatedAt)
        );
        this.#initialState = defaultState;
      }
    }
  }
  optionalRemove() {
    if (!this.observers.length && this.state.fetchStatus === "idle") {
      this.#cache.remove(this);
    }
  }
  setData(newData, options) {
    const data = replaceData(this.state.data, newData, this.options);
    this.#dispatch({
      data,
      type: "success",
      dataUpdatedAt: options?.updatedAt,
      manual: options?.manual
    });
    return data;
  }
  setState(state) {
    this.#dispatch({ type: "setState", state });
  }
  cancel(options) {
    const promise = this.#retryer?.promise;
    this.#retryer?.cancel(options);
    return promise ? promise.then(noop).catch(noop) : Promise.resolve();
  }
  destroy() {
    super.destroy();
    this.cancel({ silent: true });
  }
  get resetState() {
    return this.#initialState;
  }
  reset() {
    this.destroy();
    this.setState(this.resetState);
  }
  isActive() {
    return this.observers.some(
      (observer) => resolveQueryBoolean(observer.options.enabled, this) !== false
    );
  }
  isDisabled() {
    if (this.getObserversCount() > 0) {
      return !this.isActive();
    }
    return this.options.queryFn === skipToken || !this.isFetched();
  }
  isFetched() {
    return this.state.dataUpdateCount + this.state.errorUpdateCount > 0;
  }
  isStatic() {
    if (this.getObserversCount() > 0) {
      return this.observers.some(
        (observer) => resolveStaleTime(observer.options.staleTime, this) === "static"
      );
    }
    return false;
  }
  isStale() {
    if (this.getObserversCount() > 0) {
      return this.observers.some(
        (observer) => observer.getCurrentResult().isStale
      );
    }
    return this.state.data === void 0 || this.state.isInvalidated;
  }
  isStaleByTime(staleTime = 0) {
    if (this.state.data === void 0) {
      return true;
    }
    if (staleTime === "static") {
      return false;
    }
    if (this.state.isInvalidated) {
      return true;
    }
    return !timeUntilStale(this.state.dataUpdatedAt, staleTime);
  }
  onFocus() {
    const observer = this.observers.find((x2) => x2.shouldFetchOnWindowFocus());
    observer?.refetch({ cancelRefetch: false });
    this.#retryer?.continue();
  }
  onOnline() {
    const observer = this.observers.find((x2) => x2.shouldFetchOnReconnect());
    observer?.refetch({ cancelRefetch: false });
    this.#retryer?.continue();
  }
  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      this.clearGcTimeout();
      this.#cache.notify({ type: "observerAdded", query: this, observer });
    }
  }
  removeObserver(observer) {
    if (this.observers.includes(observer)) {
      this.observers = this.observers.filter((x2) => x2 !== observer);
      if (!this.observers.length) {
        if (this.#retryer) {
          if (this.#abortSignalConsumed || this.#isInitialPausedFetch()) {
            this.#retryer.cancel({ revert: true });
          } else {
            this.#retryer.cancelRetry();
          }
        }
        this.scheduleGc();
      }
      this.#cache.notify({ type: "observerRemoved", query: this, observer });
    }
  }
  getObserversCount() {
    return this.observers.length;
  }
  #isInitialPausedFetch() {
    return this.state.fetchStatus === "paused" && this.state.status === "pending";
  }
  invalidate() {
    if (!this.state.isInvalidated) {
      this.#dispatch({ type: "invalidate" });
    }
  }
  async fetch(options, fetchOptions) {
    if (this.state.fetchStatus !== "idle" && // If the promise in the retryer is already rejected, we have to definitely
    // re-start the fetch; there is a chance that the query is still in a
    // pending state when that happens
    this.#retryer?.status() !== "rejected") {
      if (this.state.data !== void 0 && fetchOptions?.cancelRefetch) {
        this.cancel({ silent: true });
      } else if (this.#retryer) {
        this.#retryer.continueRetry();
        return this.#retryer.promise;
      }
    }
    if (options) {
      this.setOptions(options);
    }
    if (!this.options.queryFn) {
      const observer = this.observers.find((x2) => x2.options.queryFn);
      if (observer) {
        this.setOptions(observer.options);
      }
    }
    const abortController = new AbortController();
    const addSignalProperty = (object) => {
      Object.defineProperty(object, "signal", {
        enumerable: true,
        get: () => {
          this.#abortSignalConsumed = true;
          return abortController.signal;
        }
      });
    };
    const fetchFn = () => {
      const queryFn = ensureQueryFn(this.options, fetchOptions);
      const createQueryFnContext = () => {
        const queryFnContext2 = {
          client: this.#client,
          queryKey: this.queryKey,
          meta: this.meta
        };
        addSignalProperty(queryFnContext2);
        return queryFnContext2;
      };
      const queryFnContext = createQueryFnContext();
      this.#abortSignalConsumed = false;
      if (this.options.persister) {
        return this.options.persister(
          queryFn,
          queryFnContext,
          this
        );
      }
      return queryFn(queryFnContext);
    };
    const createFetchContext = () => {
      const context2 = {
        fetchOptions,
        options: this.options,
        queryKey: this.queryKey,
        client: this.#client,
        state: this.state,
        fetchFn
      };
      addSignalProperty(context2);
      return context2;
    };
    const context = createFetchContext();
    const behavior = this.#queryType === "infinite" ? infiniteQueryBehavior(
      this.options.pages
    ) : this.options.behavior;
    behavior?.onFetch(context, this);
    this.#revertState = this.state;
    if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== context.fetchOptions?.meta) {
      this.#dispatch({ type: "fetch", meta: context.fetchOptions?.meta });
    }
    this.#retryer = createRetryer({
      initialPromise: fetchOptions?.initialPromise,
      fn: context.fetchFn,
      onCancel: (error) => {
        if (error instanceof CancelledError && error.revert) {
          this.setState({
            ...this.#revertState,
            fetchStatus: "idle"
          });
        }
        abortController.abort();
      },
      onFail: (failureCount, error) => {
        this.#dispatch({ type: "failed", failureCount, error });
      },
      onPause: () => {
        this.#dispatch({ type: "pause" });
      },
      onContinue: () => {
        this.#dispatch({ type: "continue" });
      },
      retry: context.options.retry,
      retryDelay: context.options.retryDelay,
      networkMode: context.options.networkMode,
      canRun: () => true
    });
    try {
      const data = await this.#retryer.start();
      if (data === void 0) {
        if (false) ;
        throw new Error(`${this.queryHash} data is undefined`);
      }
      this.setData(data);
      this.#cache.config.onSuccess?.(data, this);
      this.#cache.config.onSettled?.(
        data,
        this.state.error,
        this
      );
      return data;
    } catch (error) {
      if (error instanceof CancelledError) {
        if (error.silent) {
          return this.#retryer.promise;
        } else if (error.revert) {
          if (this.state.data === void 0) {
            throw error;
          }
          return this.state.data;
        }
      }
      this.#dispatch({
        type: "error",
        error
      });
      this.#cache.config.onError?.(
        error,
        this
      );
      this.#cache.config.onSettled?.(
        this.state.data,
        error,
        this
      );
      throw error;
    } finally {
      this.scheduleGc();
    }
  }
  #dispatch(action) {
    const reducer = (state) => {
      switch (action.type) {
        case "failed":
          return {
            ...state,
            fetchFailureCount: action.failureCount,
            fetchFailureReason: action.error
          };
        case "pause":
          return {
            ...state,
            fetchStatus: "paused"
          };
        case "continue":
          return {
            ...state,
            fetchStatus: "fetching"
          };
        case "fetch":
          return {
            ...state,
            ...fetchState(state.data, this.options),
            fetchMeta: action.meta ?? null
          };
        case "success":
          const newState = {
            ...state,
            ...successState(action.data, action.dataUpdatedAt),
            dataUpdateCount: state.dataUpdateCount + 1,
            ...!action.manual && {
              fetchStatus: "idle",
              fetchFailureCount: 0,
              fetchFailureReason: null
            }
          };
          this.#revertState = action.manual ? newState : void 0;
          return newState;
        case "error":
          const error = action.error;
          return {
            ...state,
            error,
            errorUpdateCount: state.errorUpdateCount + 1,
            errorUpdatedAt: Date.now(),
            fetchFailureCount: state.fetchFailureCount + 1,
            fetchFailureReason: error,
            fetchStatus: "idle",
            status: "error",
            // flag existing data as invalidated if we get a background error
            // note that "no data" always means stale so we can set unconditionally here
            isInvalidated: true
          };
        case "invalidate":
          return {
            ...state,
            isInvalidated: true
          };
        case "setState":
          return {
            ...state,
            ...action.state
          };
      }
    };
    this.state = reducer(this.state);
    notifyManager.batch(() => {
      this.observers.forEach((observer) => {
        observer.onQueryUpdate();
      });
      this.#cache.notify({ query: this, type: "updated", action });
    });
  }
};
function fetchState(data, options) {
  return {
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchStatus: canFetch(options.networkMode) ? "fetching" : "paused",
    ...data === void 0 && {
      error: null,
      status: "pending"
    }
  };
}
function successState(data, dataUpdatedAt) {
  return {
    data,
    dataUpdatedAt: dataUpdatedAt ?? Date.now(),
    error: null,
    isInvalidated: false,
    status: "success"
  };
}
function getDefaultState$1(options) {
  const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
  const hasData = data !== void 0;
  const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
  return {
    data,
    dataUpdateCount: 0,
    dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: false,
    status: hasData ? "success" : "pending",
    fetchStatus: "idle"
  };
}
var Mutation = class extends Removable {
  #client;
  #observers;
  #mutationCache;
  #retryer;
  constructor(config) {
    super();
    this.#client = config.client;
    this.mutationId = config.mutationId;
    this.#mutationCache = config.mutationCache;
    this.#observers = [];
    this.state = config.state || getDefaultState();
    this.setOptions(config.options);
    this.scheduleGc();
  }
  setOptions(options) {
    this.options = options;
    this.updateGcTime(this.options.gcTime);
  }
  get meta() {
    return this.options.meta;
  }
  addObserver(observer) {
    if (!this.#observers.includes(observer)) {
      this.#observers.push(observer);
      this.clearGcTimeout();
      this.#mutationCache.notify({
        type: "observerAdded",
        mutation: this,
        observer
      });
    }
  }
  removeObserver(observer) {
    this.#observers = this.#observers.filter((x2) => x2 !== observer);
    this.scheduleGc();
    this.#mutationCache.notify({
      type: "observerRemoved",
      mutation: this,
      observer
    });
  }
  optionalRemove() {
    if (!this.#observers.length) {
      if (this.state.status === "pending") {
        this.scheduleGc();
      } else {
        this.#mutationCache.remove(this);
      }
    }
  }
  continue() {
    return this.#retryer?.continue() ?? // continuing a mutation assumes that variables are set, mutation must have been dehydrated before
    this.execute(this.state.variables);
  }
  async execute(variables) {
    const onContinue = () => {
      this.#dispatch({ type: "continue" });
    };
    const mutationFnContext = {
      client: this.#client,
      meta: this.options.meta,
      mutationKey: this.options.mutationKey
    };
    this.#retryer = createRetryer({
      fn: () => {
        if (!this.options.mutationFn) {
          return Promise.reject(new Error("No mutationFn found"));
        }
        return this.options.mutationFn(variables, mutationFnContext);
      },
      onFail: (failureCount, error) => {
        this.#dispatch({ type: "failed", failureCount, error });
      },
      onPause: () => {
        this.#dispatch({ type: "pause" });
      },
      onContinue,
      retry: this.options.retry ?? 0,
      retryDelay: this.options.retryDelay,
      networkMode: this.options.networkMode,
      canRun: () => this.#mutationCache.canRun(this)
    });
    const restored = this.state.status === "pending";
    const isPaused = !this.#retryer.canStart();
    try {
      if (restored) {
        onContinue();
      } else {
        this.#dispatch({ type: "pending", variables, isPaused });
        if (this.#mutationCache.config.onMutate) {
          await this.#mutationCache.config.onMutate(
            variables,
            this,
            mutationFnContext
          );
        }
        const context = await this.options.onMutate?.(
          variables,
          mutationFnContext
        );
        if (context !== this.state.context) {
          this.#dispatch({
            type: "pending",
            context,
            variables,
            isPaused
          });
        }
      }
      const data = await this.#retryer.start();
      await this.#mutationCache.config.onSuccess?.(
        data,
        variables,
        this.state.context,
        this,
        mutationFnContext
      );
      await this.options.onSuccess?.(
        data,
        variables,
        this.state.context,
        mutationFnContext
      );
      await this.#mutationCache.config.onSettled?.(
        data,
        null,
        this.state.variables,
        this.state.context,
        this,
        mutationFnContext
      );
      await this.options.onSettled?.(
        data,
        null,
        variables,
        this.state.context,
        mutationFnContext
      );
      this.#dispatch({ type: "success", data });
      return data;
    } catch (error) {
      try {
        await this.#mutationCache.config.onError?.(
          error,
          variables,
          this.state.context,
          this,
          mutationFnContext
        );
      } catch (e2) {
        void Promise.reject(e2);
      }
      try {
        await this.options.onError?.(
          error,
          variables,
          this.state.context,
          mutationFnContext
        );
      } catch (e2) {
        void Promise.reject(e2);
      }
      try {
        await this.#mutationCache.config.onSettled?.(
          void 0,
          error,
          this.state.variables,
          this.state.context,
          this,
          mutationFnContext
        );
      } catch (e2) {
        void Promise.reject(e2);
      }
      try {
        await this.options.onSettled?.(
          void 0,
          error,
          variables,
          this.state.context,
          mutationFnContext
        );
      } catch (e2) {
        void Promise.reject(e2);
      }
      this.#dispatch({ type: "error", error });
      throw error;
    } finally {
      this.#mutationCache.runNext(this);
    }
  }
  #dispatch(action) {
    const reducer = (state) => {
      switch (action.type) {
        case "failed":
          return {
            ...state,
            failureCount: action.failureCount,
            failureReason: action.error
          };
        case "pause":
          return {
            ...state,
            isPaused: true
          };
        case "continue":
          return {
            ...state,
            isPaused: false
          };
        case "pending":
          return {
            ...state,
            context: action.context,
            data: void 0,
            failureCount: 0,
            failureReason: null,
            error: null,
            isPaused: action.isPaused,
            status: "pending",
            variables: action.variables,
            submittedAt: Date.now()
          };
        case "success":
          return {
            ...state,
            data: action.data,
            failureCount: 0,
            failureReason: null,
            error: null,
            status: "success",
            isPaused: false
          };
        case "error":
          return {
            ...state,
            data: void 0,
            error: action.error,
            failureCount: state.failureCount + 1,
            failureReason: action.error,
            isPaused: false,
            status: "error"
          };
      }
    };
    this.state = reducer(this.state);
    notifyManager.batch(() => {
      this.#observers.forEach((observer) => {
        observer.onMutationUpdate(action);
      });
      this.#mutationCache.notify({
        mutation: this,
        type: "updated",
        action
      });
    });
  }
};
function getDefaultState() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    status: "idle",
    variables: void 0,
    submittedAt: 0
  };
}
var MutationCache = class extends Subscribable {
  constructor(config = {}) {
    super();
    this.config = config;
    this.#mutations = /* @__PURE__ */ new Set();
    this.#scopes = /* @__PURE__ */ new Map();
    this.#mutationId = 0;
  }
  #mutations;
  #scopes;
  #mutationId;
  build(client, options, state) {
    const mutation = new Mutation({
      client,
      mutationCache: this,
      mutationId: ++this.#mutationId,
      options: client.defaultMutationOptions(options),
      state
    });
    this.add(mutation);
    return mutation;
  }
  add(mutation) {
    this.#mutations.add(mutation);
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const scopedMutations = this.#scopes.get(scope);
      if (scopedMutations) {
        scopedMutations.push(mutation);
      } else {
        this.#scopes.set(scope, [mutation]);
      }
    }
    this.notify({ type: "added", mutation });
  }
  remove(mutation) {
    if (this.#mutations.delete(mutation)) {
      const scope = scopeFor(mutation);
      if (typeof scope === "string") {
        const scopedMutations = this.#scopes.get(scope);
        if (scopedMutations) {
          if (scopedMutations.length > 1) {
            const index = scopedMutations.indexOf(mutation);
            if (index !== -1) {
              scopedMutations.splice(index, 1);
            }
          } else if (scopedMutations[0] === mutation) {
            this.#scopes.delete(scope);
          }
        }
      }
    }
    this.notify({ type: "removed", mutation });
  }
  canRun(mutation) {
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const mutationsWithSameScope = this.#scopes.get(scope);
      const firstPendingMutation = mutationsWithSameScope?.find(
        (m2) => m2.state.status === "pending"
      );
      return !firstPendingMutation || firstPendingMutation === mutation;
    } else {
      return true;
    }
  }
  runNext(mutation) {
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const foundMutation = this.#scopes.get(scope)?.find((m2) => m2 !== mutation && m2.state.isPaused);
      return foundMutation?.continue() ?? Promise.resolve();
    } else {
      return Promise.resolve();
    }
  }
  clear() {
    notifyManager.batch(() => {
      this.#mutations.forEach((mutation) => {
        this.notify({ type: "removed", mutation });
      });
      this.#mutations.clear();
      this.#scopes.clear();
    });
  }
  getAll() {
    return Array.from(this.#mutations);
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (mutation) => matchMutation(defaultedFilters, mutation)
    );
  }
  findAll(filters = {}) {
    return this.getAll().filter((mutation) => matchMutation(filters, mutation));
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  resumePausedMutations() {
    const pausedMutations = this.getAll().filter((x2) => x2.state.isPaused);
    return notifyManager.batch(
      () => Promise.all(
        pausedMutations.map((mutation) => mutation.continue().catch(noop))
      )
    );
  }
};
function scopeFor(mutation) {
  return mutation.options.scope?.id;
}
var QueryCache = class extends Subscribable {
  constructor(config = {}) {
    super();
    this.config = config;
    this.#queries = /* @__PURE__ */ new Map();
  }
  #queries;
  build(client, options, state) {
    const queryKey = options.queryKey;
    const queryHash = options.queryHash ?? hashQueryKeyByOptions(queryKey, options);
    let query = this.get(queryHash);
    if (!query) {
      query = new Query({
        client,
        queryKey,
        queryHash,
        options: client.defaultQueryOptions(options),
        state,
        defaultOptions: client.getQueryDefaults(queryKey)
      });
      this.add(query);
    }
    return query;
  }
  add(query) {
    if (!this.#queries.has(query.queryHash)) {
      this.#queries.set(query.queryHash, query);
      this.notify({
        type: "added",
        query
      });
    }
  }
  remove(query) {
    const queryInMap = this.#queries.get(query.queryHash);
    if (queryInMap) {
      query.destroy();
      if (queryInMap === query) {
        this.#queries.delete(query.queryHash);
      }
      this.notify({ type: "removed", query });
    }
  }
  clear() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        this.remove(query);
      });
    });
  }
  get(queryHash) {
    return this.#queries.get(queryHash);
  }
  getAll() {
    return [...this.#queries.values()];
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (query) => matchQuery(defaultedFilters, query)
    );
  }
  findAll(filters = {}) {
    const queries = this.getAll();
    return Object.keys(filters).length > 0 ? queries.filter((query) => matchQuery(filters, query)) : queries;
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  onFocus() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onFocus();
      });
    });
  }
  onOnline() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onOnline();
      });
    });
  }
};
var QueryClient = class {
  #queryCache;
  #mutationCache;
  #defaultOptions;
  #queryDefaults;
  #mutationDefaults;
  #mountCount;
  #unsubscribeFocus;
  #unsubscribeOnline;
  constructor(config = {}) {
    this.#queryCache = config.queryCache || new QueryCache();
    this.#mutationCache = config.mutationCache || new MutationCache();
    this.#defaultOptions = config.defaultOptions || {};
    this.#queryDefaults = /* @__PURE__ */ new Map();
    this.#mutationDefaults = /* @__PURE__ */ new Map();
    this.#mountCount = 0;
  }
  mount() {
    this.#mountCount++;
    if (this.#mountCount !== 1) return;
    this.#unsubscribeFocus = focusManager.subscribe(async (focused) => {
      if (focused) {
        await this.resumePausedMutations();
        this.#queryCache.onFocus();
      }
    });
    this.#unsubscribeOnline = onlineManager.subscribe(async (online) => {
      if (online) {
        await this.resumePausedMutations();
        this.#queryCache.onOnline();
      }
    });
  }
  unmount() {
    this.#mountCount--;
    if (this.#mountCount !== 0) return;
    this.#unsubscribeFocus?.();
    this.#unsubscribeFocus = void 0;
    this.#unsubscribeOnline?.();
    this.#unsubscribeOnline = void 0;
  }
  isFetching(filters) {
    return this.#queryCache.findAll({ ...filters, fetchStatus: "fetching" }).length;
  }
  isMutating(filters) {
    return this.#mutationCache.findAll({ ...filters, status: "pending" }).length;
  }
  /**
   * Imperative (non-reactive) way to retrieve data for a QueryKey.
   * Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
   *
   * Hint: Do not use this function inside a component, because it won't receive updates.
   * Use `useQuery` to create a `QueryObserver` that subscribes to changes.
   */
  getQueryData(queryKey) {
    const options = this.defaultQueryOptions({ queryKey });
    return this.#queryCache.get(options.queryHash)?.state.data;
  }
  ensureQueryData(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    const query = this.#queryCache.build(this, defaultedOptions);
    const cachedData = query.state.data;
    if (cachedData === void 0) {
      return this.fetchQuery(options);
    }
    if (options.revalidateIfStale && query.isStaleByTime(resolveStaleTime(defaultedOptions.staleTime, query))) {
      void this.prefetchQuery(defaultedOptions);
    }
    return Promise.resolve(cachedData);
  }
  getQueriesData(filters) {
    return this.#queryCache.findAll(filters).map(({ queryKey, state }) => {
      const data = state.data;
      return [queryKey, data];
    });
  }
  setQueryData(queryKey, updater, options) {
    const defaultedOptions = this.defaultQueryOptions({ queryKey });
    const query = this.#queryCache.get(
      defaultedOptions.queryHash
    );
    const prevData = query?.state.data;
    const data = functionalUpdate(updater, prevData);
    if (data === void 0) {
      return void 0;
    }
    return this.#queryCache.build(this, defaultedOptions).setData(data, { ...options, manual: true });
  }
  setQueriesData(filters, updater, options) {
    return notifyManager.batch(
      () => this.#queryCache.findAll(filters).map(({ queryKey }) => [
        queryKey,
        this.setQueryData(queryKey, updater, options)
      ])
    );
  }
  getQueryState(queryKey) {
    const options = this.defaultQueryOptions({ queryKey });
    return this.#queryCache.get(
      options.queryHash
    )?.state;
  }
  removeQueries(filters) {
    const queryCache = this.#queryCache;
    notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        queryCache.remove(query);
      });
    });
  }
  resetQueries(filters, options) {
    const queryCache = this.#queryCache;
    return notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        query.reset();
      });
      return this.refetchQueries(
        {
          type: "active",
          ...filters
        },
        options
      );
    });
  }
  cancelQueries(filters, cancelOptions = {}) {
    const defaultedCancelOptions = { revert: true, ...cancelOptions };
    const promises = notifyManager.batch(
      () => this.#queryCache.findAll(filters).map((query) => query.cancel(defaultedCancelOptions))
    );
    return Promise.all(promises).then(noop).catch(noop);
  }
  invalidateQueries(filters, options = {}) {
    return notifyManager.batch(() => {
      this.#queryCache.findAll(filters).forEach((query) => {
        query.invalidate();
      });
      if (filters?.refetchType === "none") {
        return Promise.resolve();
      }
      return this.refetchQueries(
        {
          ...filters,
          type: filters?.refetchType ?? filters?.type ?? "active"
        },
        options
      );
    });
  }
  refetchQueries(filters, options = {}) {
    const fetchOptions = {
      ...options,
      cancelRefetch: options.cancelRefetch ?? true
    };
    const promises = notifyManager.batch(
      () => this.#queryCache.findAll(filters).filter((query) => !query.isDisabled() && !query.isStatic()).map((query) => {
        let promise = query.fetch(void 0, fetchOptions);
        if (!fetchOptions.throwOnError) {
          promise = promise.catch(noop);
        }
        return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
      })
    );
    return Promise.all(promises).then(noop);
  }
  fetchQuery(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    if (defaultedOptions.retry === void 0) {
      defaultedOptions.retry = false;
    }
    const query = this.#queryCache.build(this, defaultedOptions);
    return query.isStaleByTime(
      resolveStaleTime(defaultedOptions.staleTime, query)
    ) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
  }
  prefetchQuery(options) {
    return this.fetchQuery(options).then(noop).catch(noop);
  }
  fetchInfiniteQuery(options) {
    options._type = "infinite";
    return this.fetchQuery(options);
  }
  prefetchInfiniteQuery(options) {
    return this.fetchInfiniteQuery(options).then(noop).catch(noop);
  }
  ensureInfiniteQueryData(options) {
    options._type = "infinite";
    return this.ensureQueryData(options);
  }
  resumePausedMutations() {
    if (onlineManager.isOnline()) {
      return this.#mutationCache.resumePausedMutations();
    }
    return Promise.resolve();
  }
  getQueryCache() {
    return this.#queryCache;
  }
  getMutationCache() {
    return this.#mutationCache;
  }
  getDefaultOptions() {
    return this.#defaultOptions;
  }
  setDefaultOptions(options) {
    this.#defaultOptions = options;
  }
  setQueryDefaults(queryKey, options) {
    this.#queryDefaults.set(hashKey(queryKey), {
      queryKey,
      defaultOptions: options
    });
  }
  getQueryDefaults(queryKey) {
    const defaults = [...this.#queryDefaults.values()];
    const result = {};
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(queryKey, queryDefault.queryKey)) {
        Object.assign(result, queryDefault.defaultOptions);
      }
    });
    return result;
  }
  setMutationDefaults(mutationKey, options) {
    this.#mutationDefaults.set(hashKey(mutationKey), {
      mutationKey,
      defaultOptions: options
    });
  }
  getMutationDefaults(mutationKey) {
    const defaults = [...this.#mutationDefaults.values()];
    const result = {};
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(mutationKey, queryDefault.mutationKey)) {
        Object.assign(result, queryDefault.defaultOptions);
      }
    });
    return result;
  }
  defaultQueryOptions(options) {
    if (options._defaulted) {
      return options;
    }
    const defaultedOptions = {
      ...this.#defaultOptions.queries,
      ...this.getQueryDefaults(options.queryKey),
      ...options,
      _defaulted: true
    };
    if (!defaultedOptions.queryHash) {
      defaultedOptions.queryHash = hashQueryKeyByOptions(
        defaultedOptions.queryKey,
        defaultedOptions
      );
    }
    if (defaultedOptions.refetchOnReconnect === void 0) {
      defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
    }
    if (defaultedOptions.throwOnError === void 0) {
      defaultedOptions.throwOnError = !!defaultedOptions.suspense;
    }
    if (!defaultedOptions.networkMode && defaultedOptions.persister) {
      defaultedOptions.networkMode = "offlineFirst";
    }
    if (defaultedOptions.queryFn === skipToken) {
      defaultedOptions.enabled = false;
    }
    return defaultedOptions;
  }
  defaultMutationOptions(options) {
    if (options?._defaulted) {
      return options;
    }
    return {
      ...this.#defaultOptions.mutations,
      ...options?.mutationKey && this.getMutationDefaults(options.mutationKey),
      ...options,
      _defaulted: true
    };
  }
  clear() {
    this.#queryCache.clear();
    this.#mutationCache.clear();
  }
};
var QueryClientContext = reactExports.createContext(
  void 0
);
var useQueryClient = (queryClient) => {
  const client = reactExports.useContext(QueryClientContext);
  if (!client) {
    throw new Error("No QueryClient set, use QueryClientProvider to set one");
  }
  return client;
};
var QueryClientProvider = ({
  client,
  children
}) => {
  reactExports.useEffect(() => {
    client.mount();
    return () => {
      client.unmount();
    };
  }, [client]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientContext.Provider, { value: client, children });
};
function __insertCSS(code) {
  if (typeof document == "undefined") return;
  let head = document.head || document.getElementsByTagName("head")[0];
  let style = document.createElement("style");
  style.type = "text/css";
  head.appendChild(style);
  style.styleSheet ? style.styleSheet.cssText = code : style.appendChild(document.createTextNode(code));
}
const getAsset = (type) => {
  switch (type) {
    case "success":
      return SuccessIcon;
    case "info":
      return InfoIcon;
    case "warning":
      return WarningIcon;
    case "error":
      return ErrorIcon;
    default:
      return null;
  }
};
const bars = Array(12).fill(0);
const Loader = ({ visible, className }) => {
  return /* @__PURE__ */ React.createElement("div", {
    className: [
      "sonner-loading-wrapper",
      className
    ].filter(Boolean).join(" "),
    "data-visible": visible
  }, /* @__PURE__ */ React.createElement("div", {
    className: "sonner-spinner"
  }, bars.map((_2, i2) => /* @__PURE__ */ React.createElement("div", {
    className: "sonner-loading-bar",
    key: `spinner-bar-${i2}`
  }))));
};
const SuccessIcon = /* @__PURE__ */ React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
  clipRule: "evenodd"
}));
const WarningIcon = /* @__PURE__ */ React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "currentColor",
  height: "20",
  width: "20"
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
  clipRule: "evenodd"
}));
const InfoIcon = /* @__PURE__ */ React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
  clipRule: "evenodd"
}));
const ErrorIcon = /* @__PURE__ */ React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
  clipRule: "evenodd"
}));
const CloseIcon = /* @__PURE__ */ React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "12",
  height: "12",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /* @__PURE__ */ React.createElement("line", {
  x1: "18",
  y1: "6",
  x2: "6",
  y2: "18"
}), /* @__PURE__ */ React.createElement("line", {
  x1: "6",
  y1: "6",
  x2: "18",
  y2: "18"
}));
const useIsDocumentHidden = () => {
  const [isDocumentHidden, setIsDocumentHidden] = React.useState(document.hidden);
  React.useEffect(() => {
    const callback = () => {
      setIsDocumentHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", callback);
    return () => window.removeEventListener("visibilitychange", callback);
  }, []);
  return isDocumentHidden;
};
let toastsCounter = 1;
class Observer {
  constructor() {
    this.subscribe = (subscriber) => {
      this.subscribers.push(subscriber);
      return () => {
        const index = this.subscribers.indexOf(subscriber);
        this.subscribers.splice(index, 1);
      };
    };
    this.publish = (data) => {
      this.subscribers.forEach((subscriber) => subscriber(data));
    };
    this.addToast = (data) => {
      this.publish(data);
      this.toasts = [
        ...this.toasts,
        data
      ];
    };
    this.create = (data) => {
      var _data_id;
      const { message, ...rest } = data;
      const id = typeof (data == null ? void 0 : data.id) === "number" || ((_data_id = data.id) == null ? void 0 : _data_id.length) > 0 ? data.id : toastsCounter++;
      const alreadyExists = this.toasts.find((toast2) => {
        return toast2.id === id;
      });
      const dismissible = data.dismissible === void 0 ? true : data.dismissible;
      if (this.dismissedToasts.has(id)) {
        this.dismissedToasts.delete(id);
      }
      if (alreadyExists) {
        this.toasts = this.toasts.map((toast2) => {
          if (toast2.id === id) {
            this.publish({
              ...toast2,
              ...data,
              id,
              title: message
            });
            return {
              ...toast2,
              ...data,
              id,
              dismissible,
              title: message
            };
          }
          return toast2;
        });
      } else {
        this.addToast({
          title: message,
          ...rest,
          dismissible,
          id
        });
      }
      return id;
    };
    this.dismiss = (id) => {
      if (id) {
        this.dismissedToasts.add(id);
        requestAnimationFrame(() => this.subscribers.forEach((subscriber) => subscriber({
          id,
          dismiss: true
        })));
      } else {
        this.toasts.forEach((toast2) => {
          this.subscribers.forEach((subscriber) => subscriber({
            id: toast2.id,
            dismiss: true
          }));
        });
      }
      return id;
    };
    this.message = (message, data) => {
      return this.create({
        ...data,
        message
      });
    };
    this.error = (message, data) => {
      return this.create({
        ...data,
        message,
        type: "error"
      });
    };
    this.success = (message, data) => {
      return this.create({
        ...data,
        type: "success",
        message
      });
    };
    this.info = (message, data) => {
      return this.create({
        ...data,
        type: "info",
        message
      });
    };
    this.warning = (message, data) => {
      return this.create({
        ...data,
        type: "warning",
        message
      });
    };
    this.loading = (message, data) => {
      return this.create({
        ...data,
        type: "loading",
        message
      });
    };
    this.promise = (promise, data) => {
      if (!data) {
        return;
      }
      let id = void 0;
      if (data.loading !== void 0) {
        id = this.create({
          ...data,
          promise,
          type: "loading",
          message: data.loading,
          description: typeof data.description !== "function" ? data.description : void 0
        });
      }
      const p2 = Promise.resolve(promise instanceof Function ? promise() : promise);
      let shouldDismiss = id !== void 0;
      let result;
      const originalPromise = p2.then(async (response) => {
        result = [
          "resolve",
          response
        ];
        const isReactElementResponse = React.isValidElement(response);
        if (isReactElementResponse) {
          shouldDismiss = false;
          this.create({
            id,
            type: "default",
            message: response
          });
        } else if (isHttpResponse(response) && !response.ok) {
          shouldDismiss = false;
          const promiseData = typeof data.error === "function" ? await data.error(`HTTP error! status: ${response.status}`) : data.error;
          const description = typeof data.description === "function" ? await data.description(`HTTP error! status: ${response.status}`) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !React.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
          this.create({
            id,
            type: "error",
            description,
            ...toastSettings
          });
        } else if (response instanceof Error) {
          shouldDismiss = false;
          const promiseData = typeof data.error === "function" ? await data.error(response) : data.error;
          const description = typeof data.description === "function" ? await data.description(response) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !React.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
          this.create({
            id,
            type: "error",
            description,
            ...toastSettings
          });
        } else if (data.success !== void 0) {
          shouldDismiss = false;
          const promiseData = typeof data.success === "function" ? await data.success(response) : data.success;
          const description = typeof data.description === "function" ? await data.description(response) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !React.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
          this.create({
            id,
            type: "success",
            description,
            ...toastSettings
          });
        }
      }).catch(async (error) => {
        result = [
          "reject",
          error
        ];
        if (data.error !== void 0) {
          shouldDismiss = false;
          const promiseData = typeof data.error === "function" ? await data.error(error) : data.error;
          const description = typeof data.description === "function" ? await data.description(error) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !React.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
          this.create({
            id,
            type: "error",
            description,
            ...toastSettings
          });
        }
      }).finally(() => {
        if (shouldDismiss) {
          this.dismiss(id);
          id = void 0;
        }
        data.finally == null ? void 0 : data.finally.call(data);
      });
      const unwrap = () => new Promise((resolve, reject) => originalPromise.then(() => result[0] === "reject" ? reject(result[1]) : resolve(result[1])).catch(reject));
      if (typeof id !== "string" && typeof id !== "number") {
        return {
          unwrap
        };
      } else {
        return Object.assign(id, {
          unwrap
        });
      }
    };
    this.custom = (jsx, data) => {
      const id = (data == null ? void 0 : data.id) || toastsCounter++;
      this.create({
        jsx: jsx(id),
        id,
        ...data
      });
      return id;
    };
    this.getActiveToasts = () => {
      return this.toasts.filter((toast2) => !this.dismissedToasts.has(toast2.id));
    };
    this.subscribers = [];
    this.toasts = [];
    this.dismissedToasts = /* @__PURE__ */ new Set();
  }
}
const ToastState = new Observer();
const toastFunction = (message, data) => {
  const id = (data == null ? void 0 : data.id) || toastsCounter++;
  ToastState.addToast({
    title: message,
    ...data,
    id
  });
  return id;
};
const isHttpResponse = (data) => {
  return data && typeof data === "object" && "ok" in data && typeof data.ok === "boolean" && "status" in data && typeof data.status === "number";
};
const basicToast = toastFunction;
const getHistory = () => ToastState.toasts;
const getToasts = () => ToastState.getActiveToasts();
const toast = Object.assign(basicToast, {
  success: ToastState.success,
  info: ToastState.info,
  warning: ToastState.warning,
  error: ToastState.error,
  custom: ToastState.custom,
  message: ToastState.message,
  promise: ToastState.promise,
  dismiss: ToastState.dismiss,
  loading: ToastState.loading
}, {
  getHistory,
  getToasts
});
__insertCSS("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");
function isAction(action) {
  return action.label !== void 0;
}
const VISIBLE_TOASTS_AMOUNT = 3;
const VIEWPORT_OFFSET = "24px";
const MOBILE_VIEWPORT_OFFSET = "16px";
const TOAST_LIFETIME = 4e3;
const TOAST_WIDTH = 356;
const GAP = 14;
const SWIPE_THRESHOLD = 45;
const TIME_BEFORE_UNMOUNT = 200;
function cn$1(...classes) {
  return classes.filter(Boolean).join(" ");
}
function getDefaultSwipeDirections(position) {
  const [y2, x2] = position.split("-");
  const directions = [];
  if (y2) {
    directions.push(y2);
  }
  if (x2) {
    directions.push(x2);
  }
  return directions;
}
const Toast = (props) => {
  var _toast_classNames, _toast_classNames1, _toast_classNames2, _toast_classNames3, _toast_classNames4, _toast_classNames5, _toast_classNames6, _toast_classNames7, _toast_classNames8;
  const { invert: ToasterInvert, toast: toast2, unstyled, interacting, setHeights, visibleToasts, heights, index, toasts, expanded, removeToast, defaultRichColors, closeButton: closeButtonFromToaster, style, cancelButtonStyle, actionButtonStyle, className = "", descriptionClassName = "", duration: durationFromToaster, position, gap, expandByDefault, classNames, icons, closeButtonAriaLabel = "Close toast" } = props;
  const [swipeDirection, setSwipeDirection] = React.useState(null);
  const [swipeOutDirection, setSwipeOutDirection] = React.useState(null);
  const [mounted, setMounted] = React.useState(false);
  const [removed, setRemoved] = React.useState(false);
  const [swiping, setSwiping] = React.useState(false);
  const [swipeOut, setSwipeOut] = React.useState(false);
  const [isSwiped, setIsSwiped] = React.useState(false);
  const [offsetBeforeRemove, setOffsetBeforeRemove] = React.useState(0);
  const [initialHeight, setInitialHeight] = React.useState(0);
  const remainingTime = React.useRef(toast2.duration || durationFromToaster || TOAST_LIFETIME);
  const dragStartTime = React.useRef(null);
  const toastRef = React.useRef(null);
  const isFront = index === 0;
  const isVisible = index + 1 <= visibleToasts;
  const toastType = toast2.type;
  const dismissible = toast2.dismissible !== false;
  const toastClassname = toast2.className || "";
  const toastDescriptionClassname = toast2.descriptionClassName || "";
  const heightIndex = React.useMemo(() => heights.findIndex((height) => height.toastId === toast2.id) || 0, [
    heights,
    toast2.id
  ]);
  const closeButton = React.useMemo(() => {
    var _toast_closeButton;
    return (_toast_closeButton = toast2.closeButton) != null ? _toast_closeButton : closeButtonFromToaster;
  }, [
    toast2.closeButton,
    closeButtonFromToaster
  ]);
  const duration = React.useMemo(() => toast2.duration || durationFromToaster || TOAST_LIFETIME, [
    toast2.duration,
    durationFromToaster
  ]);
  const closeTimerStartTimeRef = React.useRef(0);
  const offset = React.useRef(0);
  const lastCloseTimerStartTimeRef = React.useRef(0);
  const pointerStartRef = React.useRef(null);
  const [y2, x2] = position.split("-");
  const toastsHeightBefore = React.useMemo(() => {
    return heights.reduce((prev, curr, reducerIndex) => {
      if (reducerIndex >= heightIndex) {
        return prev;
      }
      return prev + curr.height;
    }, 0);
  }, [
    heights,
    heightIndex
  ]);
  const isDocumentHidden = useIsDocumentHidden();
  const invert = toast2.invert || ToasterInvert;
  const disabled = toastType === "loading";
  offset.current = React.useMemo(() => heightIndex * gap + toastsHeightBefore, [
    heightIndex,
    toastsHeightBefore
  ]);
  React.useEffect(() => {
    remainingTime.current = duration;
  }, [
    duration
  ]);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  React.useEffect(() => {
    const toastNode = toastRef.current;
    if (toastNode) {
      const height = toastNode.getBoundingClientRect().height;
      setInitialHeight(height);
      setHeights((h2) => [
        {
          toastId: toast2.id,
          height,
          position: toast2.position
        },
        ...h2
      ]);
      return () => setHeights((h2) => h2.filter((height2) => height2.toastId !== toast2.id));
    }
  }, [
    setHeights,
    toast2.id
  ]);
  React.useLayoutEffect(() => {
    if (!mounted) return;
    const toastNode = toastRef.current;
    const originalHeight = toastNode.style.height;
    toastNode.style.height = "auto";
    const newHeight = toastNode.getBoundingClientRect().height;
    toastNode.style.height = originalHeight;
    setInitialHeight(newHeight);
    setHeights((heights2) => {
      const alreadyExists = heights2.find((height) => height.toastId === toast2.id);
      if (!alreadyExists) {
        return [
          {
            toastId: toast2.id,
            height: newHeight,
            position: toast2.position
          },
          ...heights2
        ];
      } else {
        return heights2.map((height) => height.toastId === toast2.id ? {
          ...height,
          height: newHeight
        } : height);
      }
    });
  }, [
    mounted,
    toast2.title,
    toast2.description,
    setHeights,
    toast2.id,
    toast2.jsx,
    toast2.action,
    toast2.cancel
  ]);
  const deleteToast = React.useCallback(() => {
    setRemoved(true);
    setOffsetBeforeRemove(offset.current);
    setHeights((h2) => h2.filter((height) => height.toastId !== toast2.id));
    setTimeout(() => {
      removeToast(toast2);
    }, TIME_BEFORE_UNMOUNT);
  }, [
    toast2,
    removeToast,
    setHeights,
    offset
  ]);
  React.useEffect(() => {
    if (toast2.promise && toastType === "loading" || toast2.duration === Infinity || toast2.type === "loading") return;
    let timeoutId;
    const pauseTimer = () => {
      if (lastCloseTimerStartTimeRef.current < closeTimerStartTimeRef.current) {
        const elapsedTime = (/* @__PURE__ */ new Date()).getTime() - closeTimerStartTimeRef.current;
        remainingTime.current = remainingTime.current - elapsedTime;
      }
      lastCloseTimerStartTimeRef.current = (/* @__PURE__ */ new Date()).getTime();
    };
    const startTimer = () => {
      if (remainingTime.current === Infinity) return;
      closeTimerStartTimeRef.current = (/* @__PURE__ */ new Date()).getTime();
      timeoutId = setTimeout(() => {
        toast2.onAutoClose == null ? void 0 : toast2.onAutoClose.call(toast2, toast2);
        deleteToast();
      }, remainingTime.current);
    };
    if (expanded || interacting || isDocumentHidden) {
      pauseTimer();
    } else {
      startTimer();
    }
    return () => clearTimeout(timeoutId);
  }, [
    expanded,
    interacting,
    toast2,
    toastType,
    isDocumentHidden,
    deleteToast
  ]);
  React.useEffect(() => {
    if (toast2.delete) {
      deleteToast();
      toast2.onDismiss == null ? void 0 : toast2.onDismiss.call(toast2, toast2);
    }
  }, [
    deleteToast,
    toast2.delete
  ]);
  function getLoadingIcon() {
    var _toast_classNames9;
    if (icons == null ? void 0 : icons.loading) {
      var _toast_classNames12;
      return /* @__PURE__ */ React.createElement("div", {
        className: cn$1(classNames == null ? void 0 : classNames.loader, toast2 == null ? void 0 : (_toast_classNames12 = toast2.classNames) == null ? void 0 : _toast_classNames12.loader, "sonner-loader"),
        "data-visible": toastType === "loading"
      }, icons.loading);
    }
    return /* @__PURE__ */ React.createElement(Loader, {
      className: cn$1(classNames == null ? void 0 : classNames.loader, toast2 == null ? void 0 : (_toast_classNames9 = toast2.classNames) == null ? void 0 : _toast_classNames9.loader),
      visible: toastType === "loading"
    });
  }
  const icon = toast2.icon || (icons == null ? void 0 : icons[toastType]) || getAsset(toastType);
  var _toast_richColors, _icons_close;
  return /* @__PURE__ */ React.createElement("li", {
    tabIndex: 0,
    ref: toastRef,
    className: cn$1(className, toastClassname, classNames == null ? void 0 : classNames.toast, toast2 == null ? void 0 : (_toast_classNames = toast2.classNames) == null ? void 0 : _toast_classNames.toast, classNames == null ? void 0 : classNames.default, classNames == null ? void 0 : classNames[toastType], toast2 == null ? void 0 : (_toast_classNames1 = toast2.classNames) == null ? void 0 : _toast_classNames1[toastType]),
    "data-sonner-toast": "",
    "data-rich-colors": (_toast_richColors = toast2.richColors) != null ? _toast_richColors : defaultRichColors,
    "data-styled": !Boolean(toast2.jsx || toast2.unstyled || unstyled),
    "data-mounted": mounted,
    "data-promise": Boolean(toast2.promise),
    "data-swiped": isSwiped,
    "data-removed": removed,
    "data-visible": isVisible,
    "data-y-position": y2,
    "data-x-position": x2,
    "data-index": index,
    "data-front": isFront,
    "data-swiping": swiping,
    "data-dismissible": dismissible,
    "data-type": toastType,
    "data-invert": invert,
    "data-swipe-out": swipeOut,
    "data-swipe-direction": swipeOutDirection,
    "data-expanded": Boolean(expanded || expandByDefault && mounted),
    "data-testid": toast2.testId,
    style: {
      "--index": index,
      "--toasts-before": index,
      "--z-index": toasts.length - index,
      "--offset": `${removed ? offsetBeforeRemove : offset.current}px`,
      "--initial-height": expandByDefault ? "auto" : `${initialHeight}px`,
      ...style,
      ...toast2.style
    },
    onDragEnd: () => {
      setSwiping(false);
      setSwipeDirection(null);
      pointerStartRef.current = null;
    },
    onPointerDown: (event) => {
      if (event.button === 2) return;
      if (disabled || !dismissible) return;
      dragStartTime.current = /* @__PURE__ */ new Date();
      setOffsetBeforeRemove(offset.current);
      event.target.setPointerCapture(event.pointerId);
      if (event.target.tagName === "BUTTON") return;
      setSwiping(true);
      pointerStartRef.current = {
        x: event.clientX,
        y: event.clientY
      };
    },
    onPointerUp: () => {
      var _toastRef_current, _toastRef_current1, _dragStartTime_current;
      if (swipeOut || !dismissible) return;
      pointerStartRef.current = null;
      const swipeAmountX = Number(((_toastRef_current = toastRef.current) == null ? void 0 : _toastRef_current.style.getPropertyValue("--swipe-amount-x").replace("px", "")) || 0);
      const swipeAmountY = Number(((_toastRef_current1 = toastRef.current) == null ? void 0 : _toastRef_current1.style.getPropertyValue("--swipe-amount-y").replace("px", "")) || 0);
      const timeTaken = (/* @__PURE__ */ new Date()).getTime() - ((_dragStartTime_current = dragStartTime.current) == null ? void 0 : _dragStartTime_current.getTime());
      const swipeAmount = swipeDirection === "x" ? swipeAmountX : swipeAmountY;
      const velocity = Math.abs(swipeAmount) / timeTaken;
      if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
        setOffsetBeforeRemove(offset.current);
        toast2.onDismiss == null ? void 0 : toast2.onDismiss.call(toast2, toast2);
        if (swipeDirection === "x") {
          setSwipeOutDirection(swipeAmountX > 0 ? "right" : "left");
        } else {
          setSwipeOutDirection(swipeAmountY > 0 ? "down" : "up");
        }
        deleteToast();
        setSwipeOut(true);
        return;
      } else {
        var _toastRef_current2, _toastRef_current3;
        (_toastRef_current2 = toastRef.current) == null ? void 0 : _toastRef_current2.style.setProperty("--swipe-amount-x", `0px`);
        (_toastRef_current3 = toastRef.current) == null ? void 0 : _toastRef_current3.style.setProperty("--swipe-amount-y", `0px`);
      }
      setIsSwiped(false);
      setSwiping(false);
      setSwipeDirection(null);
    },
    onPointerMove: (event) => {
      var _window_getSelection, _toastRef_current, _toastRef_current1;
      if (!pointerStartRef.current || !dismissible) return;
      const isHighlighted = ((_window_getSelection = window.getSelection()) == null ? void 0 : _window_getSelection.toString().length) > 0;
      if (isHighlighted) return;
      const yDelta = event.clientY - pointerStartRef.current.y;
      const xDelta = event.clientX - pointerStartRef.current.x;
      var _props_swipeDirections;
      const swipeDirections = (_props_swipeDirections = props.swipeDirections) != null ? _props_swipeDirections : getDefaultSwipeDirections(position);
      if (!swipeDirection && (Math.abs(xDelta) > 1 || Math.abs(yDelta) > 1)) {
        setSwipeDirection(Math.abs(xDelta) > Math.abs(yDelta) ? "x" : "y");
      }
      let swipeAmount = {
        x: 0,
        y: 0
      };
      const getDampening = (delta) => {
        const factor = Math.abs(delta) / 20;
        return 1 / (1.5 + factor);
      };
      if (swipeDirection === "y") {
        if (swipeDirections.includes("top") || swipeDirections.includes("bottom")) {
          if (swipeDirections.includes("top") && yDelta < 0 || swipeDirections.includes("bottom") && yDelta > 0) {
            swipeAmount.y = yDelta;
          } else {
            const dampenedDelta = yDelta * getDampening(yDelta);
            swipeAmount.y = Math.abs(dampenedDelta) < Math.abs(yDelta) ? dampenedDelta : yDelta;
          }
        }
      } else if (swipeDirection === "x") {
        if (swipeDirections.includes("left") || swipeDirections.includes("right")) {
          if (swipeDirections.includes("left") && xDelta < 0 || swipeDirections.includes("right") && xDelta > 0) {
            swipeAmount.x = xDelta;
          } else {
            const dampenedDelta = xDelta * getDampening(xDelta);
            swipeAmount.x = Math.abs(dampenedDelta) < Math.abs(xDelta) ? dampenedDelta : xDelta;
          }
        }
      }
      if (Math.abs(swipeAmount.x) > 0 || Math.abs(swipeAmount.y) > 0) {
        setIsSwiped(true);
      }
      (_toastRef_current = toastRef.current) == null ? void 0 : _toastRef_current.style.setProperty("--swipe-amount-x", `${swipeAmount.x}px`);
      (_toastRef_current1 = toastRef.current) == null ? void 0 : _toastRef_current1.style.setProperty("--swipe-amount-y", `${swipeAmount.y}px`);
    }
  }, closeButton && !toast2.jsx && toastType !== "loading" ? /* @__PURE__ */ React.createElement("button", {
    "aria-label": closeButtonAriaLabel,
    "data-disabled": disabled,
    "data-close-button": true,
    onClick: disabled || !dismissible ? () => {
    } : () => {
      deleteToast();
      toast2.onDismiss == null ? void 0 : toast2.onDismiss.call(toast2, toast2);
    },
    className: cn$1(classNames == null ? void 0 : classNames.closeButton, toast2 == null ? void 0 : (_toast_classNames2 = toast2.classNames) == null ? void 0 : _toast_classNames2.closeButton)
  }, (_icons_close = icons == null ? void 0 : icons.close) != null ? _icons_close : CloseIcon) : null, (toastType || toast2.icon || toast2.promise) && toast2.icon !== null && ((icons == null ? void 0 : icons[toastType]) !== null || toast2.icon) ? /* @__PURE__ */ React.createElement("div", {
    "data-icon": "",
    className: cn$1(classNames == null ? void 0 : classNames.icon, toast2 == null ? void 0 : (_toast_classNames3 = toast2.classNames) == null ? void 0 : _toast_classNames3.icon)
  }, toast2.promise || toast2.type === "loading" && !toast2.icon ? toast2.icon || getLoadingIcon() : null, toast2.type !== "loading" ? icon : null) : null, /* @__PURE__ */ React.createElement("div", {
    "data-content": "",
    className: cn$1(classNames == null ? void 0 : classNames.content, toast2 == null ? void 0 : (_toast_classNames4 = toast2.classNames) == null ? void 0 : _toast_classNames4.content)
  }, /* @__PURE__ */ React.createElement("div", {
    "data-title": "",
    className: cn$1(classNames == null ? void 0 : classNames.title, toast2 == null ? void 0 : (_toast_classNames5 = toast2.classNames) == null ? void 0 : _toast_classNames5.title)
  }, toast2.jsx ? toast2.jsx : typeof toast2.title === "function" ? toast2.title() : toast2.title), toast2.description ? /* @__PURE__ */ React.createElement("div", {
    "data-description": "",
    className: cn$1(descriptionClassName, toastDescriptionClassname, classNames == null ? void 0 : classNames.description, toast2 == null ? void 0 : (_toast_classNames6 = toast2.classNames) == null ? void 0 : _toast_classNames6.description)
  }, typeof toast2.description === "function" ? toast2.description() : toast2.description) : null), /* @__PURE__ */ React.isValidElement(toast2.cancel) ? toast2.cancel : toast2.cancel && isAction(toast2.cancel) ? /* @__PURE__ */ React.createElement("button", {
    "data-button": true,
    "data-cancel": true,
    style: toast2.cancelButtonStyle || cancelButtonStyle,
    onClick: (event) => {
      if (!isAction(toast2.cancel)) return;
      if (!dismissible) return;
      toast2.cancel.onClick == null ? void 0 : toast2.cancel.onClick.call(toast2.cancel, event);
      deleteToast();
    },
    className: cn$1(classNames == null ? void 0 : classNames.cancelButton, toast2 == null ? void 0 : (_toast_classNames7 = toast2.classNames) == null ? void 0 : _toast_classNames7.cancelButton)
  }, toast2.cancel.label) : null, /* @__PURE__ */ React.isValidElement(toast2.action) ? toast2.action : toast2.action && isAction(toast2.action) ? /* @__PURE__ */ React.createElement("button", {
    "data-button": true,
    "data-action": true,
    style: toast2.actionButtonStyle || actionButtonStyle,
    onClick: (event) => {
      if (!isAction(toast2.action)) return;
      toast2.action.onClick == null ? void 0 : toast2.action.onClick.call(toast2.action, event);
      if (event.defaultPrevented) return;
      deleteToast();
    },
    className: cn$1(classNames == null ? void 0 : classNames.actionButton, toast2 == null ? void 0 : (_toast_classNames8 = toast2.classNames) == null ? void 0 : _toast_classNames8.actionButton)
  }, toast2.action.label) : null);
};
function getDocumentDirection() {
  if (typeof window === "undefined") return "ltr";
  if (typeof document === "undefined") return "ltr";
  const dirAttribute = document.documentElement.getAttribute("dir");
  if (dirAttribute === "auto" || !dirAttribute) {
    return window.getComputedStyle(document.documentElement).direction;
  }
  return dirAttribute;
}
function assignOffset(defaultOffset, mobileOffset) {
  const styles = {};
  [
    defaultOffset,
    mobileOffset
  ].forEach((offset, index) => {
    const isMobile = index === 1;
    const prefix = isMobile ? "--mobile-offset" : "--offset";
    const defaultValue = isMobile ? MOBILE_VIEWPORT_OFFSET : VIEWPORT_OFFSET;
    function assignAll(offset2) {
      [
        "top",
        "right",
        "bottom",
        "left"
      ].forEach((key) => {
        styles[`${prefix}-${key}`] = typeof offset2 === "number" ? `${offset2}px` : offset2;
      });
    }
    if (typeof offset === "number" || typeof offset === "string") {
      assignAll(offset);
    } else if (typeof offset === "object") {
      [
        "top",
        "right",
        "bottom",
        "left"
      ].forEach((key) => {
        if (offset[key] === void 0) {
          styles[`${prefix}-${key}`] = defaultValue;
        } else {
          styles[`${prefix}-${key}`] = typeof offset[key] === "number" ? `${offset[key]}px` : offset[key];
        }
      });
    } else {
      assignAll(defaultValue);
    }
  });
  return styles;
}
const Toaster = /* @__PURE__ */ React.forwardRef(function Toaster2(props, ref) {
  const { id, invert, position = "bottom-right", hotkey = [
    "altKey",
    "KeyT"
  ], expand, closeButton, className, offset, mobileOffset, theme = "light", richColors, duration, style, visibleToasts = VISIBLE_TOASTS_AMOUNT, toastOptions, dir = getDocumentDirection(), gap = GAP, icons, containerAriaLabel = "Notifications" } = props;
  const [toasts, setToasts] = React.useState([]);
  const filteredToasts = React.useMemo(() => {
    if (id) {
      return toasts.filter((toast2) => toast2.toasterId === id);
    }
    return toasts.filter((toast2) => !toast2.toasterId);
  }, [
    toasts,
    id
  ]);
  const possiblePositions = React.useMemo(() => {
    return Array.from(new Set([
      position
    ].concat(filteredToasts.filter((toast2) => toast2.position).map((toast2) => toast2.position))));
  }, [
    filteredToasts,
    position
  ]);
  const [heights, setHeights] = React.useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [interacting, setInteracting] = React.useState(false);
  const [actualTheme, setActualTheme] = React.useState(theme !== "system" ? theme : typeof window !== "undefined" ? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : "light");
  const listRef = React.useRef(null);
  const hotkeyLabel = hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
  const lastFocusedElementRef = React.useRef(null);
  const isFocusWithinRef = React.useRef(false);
  const removeToast = React.useCallback((toastToRemove) => {
    setToasts((toasts2) => {
      var _toasts_find;
      if (!((_toasts_find = toasts2.find((toast2) => toast2.id === toastToRemove.id)) == null ? void 0 : _toasts_find.delete)) {
        ToastState.dismiss(toastToRemove.id);
      }
      return toasts2.filter(({ id: id2 }) => id2 !== toastToRemove.id);
    });
  }, []);
  React.useEffect(() => {
    return ToastState.subscribe((toast2) => {
      if (toast2.dismiss) {
        requestAnimationFrame(() => {
          setToasts((toasts2) => toasts2.map((t2) => t2.id === toast2.id ? {
            ...t2,
            delete: true
          } : t2));
        });
        return;
      }
      setTimeout(() => {
        ReactDOM.flushSync(() => {
          setToasts((toasts2) => {
            const indexOfExistingToast = toasts2.findIndex((t2) => t2.id === toast2.id);
            if (indexOfExistingToast !== -1) {
              return [
                ...toasts2.slice(0, indexOfExistingToast),
                {
                  ...toasts2[indexOfExistingToast],
                  ...toast2
                },
                ...toasts2.slice(indexOfExistingToast + 1)
              ];
            }
            return [
              toast2,
              ...toasts2
            ];
          });
        });
      });
    });
  }, [
    toasts
  ]);
  React.useEffect(() => {
    if (theme !== "system") {
      setActualTheme(theme);
      return;
    }
    if (theme === "system") {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setActualTheme("dark");
      } else {
        setActualTheme("light");
      }
    }
    if (typeof window === "undefined") return;
    const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    try {
      darkMediaQuery.addEventListener("change", ({ matches }) => {
        if (matches) {
          setActualTheme("dark");
        } else {
          setActualTheme("light");
        }
      });
    } catch (error) {
      darkMediaQuery.addListener(({ matches }) => {
        try {
          if (matches) {
            setActualTheme("dark");
          } else {
            setActualTheme("light");
          }
        } catch (e2) {
          console.error(e2);
        }
      });
    }
  }, [
    theme
  ]);
  React.useEffect(() => {
    if (toasts.length <= 1) {
      setExpanded(false);
    }
  }, [
    toasts
  ]);
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      var _listRef_current;
      const isHotkeyPressed = hotkey.every((key) => event[key] || event.code === key);
      if (isHotkeyPressed) {
        var _listRef_current1;
        setExpanded(true);
        (_listRef_current1 = listRef.current) == null ? void 0 : _listRef_current1.focus();
      }
      if (event.code === "Escape" && (document.activeElement === listRef.current || ((_listRef_current = listRef.current) == null ? void 0 : _listRef_current.contains(document.activeElement)))) {
        setExpanded(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    hotkey
  ]);
  React.useEffect(() => {
    if (listRef.current) {
      return () => {
        if (lastFocusedElementRef.current) {
          lastFocusedElementRef.current.focus({
            preventScroll: true
          });
          lastFocusedElementRef.current = null;
          isFocusWithinRef.current = false;
        }
      };
    }
  }, [
    listRef.current
  ]);
  return (
    // Remove item from normal navigation flow, only available via hotkey
    /* @__PURE__ */ React.createElement("section", {
      ref,
      "aria-label": `${containerAriaLabel} ${hotkeyLabel}`,
      tabIndex: -1,
      "aria-live": "polite",
      "aria-relevant": "additions text",
      "aria-atomic": "false",
      suppressHydrationWarning: true
    }, possiblePositions.map((position2, index) => {
      var _heights_;
      const [y2, x2] = position2.split("-");
      if (!filteredToasts.length) return null;
      return /* @__PURE__ */ React.createElement("ol", {
        key: position2,
        dir: dir === "auto" ? getDocumentDirection() : dir,
        tabIndex: -1,
        ref: listRef,
        className,
        "data-sonner-toaster": true,
        "data-sonner-theme": actualTheme,
        "data-y-position": y2,
        "data-x-position": x2,
        style: {
          "--front-toast-height": `${((_heights_ = heights[0]) == null ? void 0 : _heights_.height) || 0}px`,
          "--width": `${TOAST_WIDTH}px`,
          "--gap": `${gap}px`,
          ...style,
          ...assignOffset(offset, mobileOffset)
        },
        onBlur: (event) => {
          if (isFocusWithinRef.current && !event.currentTarget.contains(event.relatedTarget)) {
            isFocusWithinRef.current = false;
            if (lastFocusedElementRef.current) {
              lastFocusedElementRef.current.focus({
                preventScroll: true
              });
              lastFocusedElementRef.current = null;
            }
          }
        },
        onFocus: (event) => {
          const isNotDismissible = event.target instanceof HTMLElement && event.target.dataset.dismissible === "false";
          if (isNotDismissible) return;
          if (!isFocusWithinRef.current) {
            isFocusWithinRef.current = true;
            lastFocusedElementRef.current = event.relatedTarget;
          }
        },
        onMouseEnter: () => setExpanded(true),
        onMouseMove: () => setExpanded(true),
        onMouseLeave: () => {
          if (!interacting) {
            setExpanded(false);
          }
        },
        onDragEnd: () => setExpanded(false),
        onPointerDown: (event) => {
          const isNotDismissible = event.target instanceof HTMLElement && event.target.dataset.dismissible === "false";
          if (isNotDismissible) return;
          setInteracting(true);
        },
        onPointerUp: () => setInteracting(false)
      }, filteredToasts.filter((toast2) => !toast2.position && index === 0 || toast2.position === position2).map((toast2, index2) => {
        var _toastOptions_duration, _toastOptions_closeButton;
        return /* @__PURE__ */ React.createElement(Toast, {
          key: toast2.id,
          icons,
          index: index2,
          toast: toast2,
          defaultRichColors: richColors,
          duration: (_toastOptions_duration = toastOptions == null ? void 0 : toastOptions.duration) != null ? _toastOptions_duration : duration,
          className: toastOptions == null ? void 0 : toastOptions.className,
          descriptionClassName: toastOptions == null ? void 0 : toastOptions.descriptionClassName,
          invert,
          visibleToasts,
          closeButton: (_toastOptions_closeButton = toastOptions == null ? void 0 : toastOptions.closeButton) != null ? _toastOptions_closeButton : closeButton,
          interacting,
          position: position2,
          style: toastOptions == null ? void 0 : toastOptions.style,
          unstyled: toastOptions == null ? void 0 : toastOptions.unstyled,
          classNames: toastOptions == null ? void 0 : toastOptions.classNames,
          cancelButtonStyle: toastOptions == null ? void 0 : toastOptions.cancelButtonStyle,
          actionButtonStyle: toastOptions == null ? void 0 : toastOptions.actionButtonStyle,
          closeButtonAriaLabel: toastOptions == null ? void 0 : toastOptions.closeButtonAriaLabel,
          removeToast,
          toasts: filteredToasts.filter((t2) => t2.position == toast2.position),
          heights: heights.filter((h2) => h2.position == toast2.position),
          setHeights,
          expandByDefault: expand,
          gap,
          expanded,
          swipeDirections: props.swipeDirections
        });
      }));
    }))
  );
});
function useNotificationsRealtime() {
  const qc = useQueryClient();
  const userIdRef = reactExports.useRef(null);
  const setupIdRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    let channel = null;
    let alive = true;
    const teardownChannel = () => {
      if (channel) {
        supabase.removeChannel(channel);
        channel = null;
      }
    };
    const setup = async (nextUserId) => {
      const setupId = ++setupIdRef.current;
      const userId = nextUserId ?? (await supabase.auth.getSession()).data.session?.user.id ?? null;
      if (!alive || !userId) return;
      if (userId === userIdRef.current && channel) return;
      teardownChannel();
      if (!alive || setupId !== setupIdRef.current) return;
      userIdRef.current = userId;
      channel = supabase.channel(`notif-rt-${userId}-${setupId}`).on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        (payload) => {
          qc.invalidateQueries({ queryKey: ["notifications"] });
          qc.invalidateQueries({ queryKey: ["notifications-unread"] });
          const n2 = payload.new;
          const title = previewTitle(n2);
          toast(title, { description: previewBody(n2) });
          if (typeof window !== "undefined" && "Notification" in window && document.hidden && Notification.permission === "granted") {
            try {
              new Notification("Pulse · " + title, { body: previewBody(n2), tag: n2.id });
            } catch {
            }
          }
        }
      ).subscribe();
    };
    setup();
    const onAuth = supabase.auth.onAuthStateChange((_e2, session) => {
      if (session?.user.id !== userIdRef.current) {
        teardownChannel();
        userIdRef.current = null;
        setup(session?.user.id ?? null);
      }
    });
    return () => {
      alive = false;
      onAuth.data.subscription.unsubscribe();
      teardownChannel();
    };
  }, [qc]);
}
function previewTitle(n2) {
  const p2 = n2.payload || {};
  switch (n2.type) {
    case "message":
      return `${p2.sender_name ?? "有人"} 给你发了消息`;
    case "like":
      return `${p2.swiper_name ?? "有人"} 喜欢了你`;
    case "match":
      return `你和 ${p2.other_name ?? "Ta"} 互相喜欢！`;
    case "comment":
      return `${p2.commenter_name ?? "有人"} 评论了你的动态`;
    case "post_like":
      return `${p2.liker_name ?? "有人"} 赞了你的动态`;
    case "follow":
      return `${p2.follower_name ?? "有人"} 关注了你`;
    case "gift":
      return `${p2.sender_name ?? "有人"} 送了你 ${p2.gift_code ?? "一份礼物"}`;
    case "video_like":
      return `有人赞了你的短视频`;
    default:
      return "新通知";
  }
}
function previewBody(n2) {
  const p2 = n2.payload || {};
  return p2.preview || p2.post_title || "";
}
var t = "undefined" != typeof window ? window : void 0, e = "undefined" != typeof globalThis ? globalThis : t;
"undefined" == typeof self && (e.self = e), "undefined" == typeof File && (e.File = function() {
});
var i = null == e ? void 0 : e.navigator, r = null == e ? void 0 : e.document, s = null == e ? void 0 : e.location, n = null == e ? void 0 : e.fetch, o = null != e && e.XMLHttpRequest && "withCredentials" in new e.XMLHttpRequest() ? e.XMLHttpRequest : void 0, a = null == e ? void 0 : e.AbortController, l = null == e ? void 0 : e.CompressionStream, u = null == i ? void 0 : i.userAgent, h = null != t ? t : {}, d = "1.376.5", v = { DEBUG: false, LIB_VERSION: d, LIB_NAME: "web", JS_SDK_VERSION: d };
function c(t2, e2, i2, r2, s2, n2, o2) {
  try {
    var a2 = t2[n2](o2), l2 = a2.value;
  } catch (t3) {
    return void i2(t3);
  }
  a2.done ? e2(l2) : Promise.resolve(l2).then(r2, s2);
}
function p(t2) {
  return function() {
    var e2 = this, i2 = arguments;
    return new Promise((function(r2, s2) {
      var n2 = t2.apply(e2, i2);
      function o2(t3) {
        c(n2, r2, s2, o2, a2, "next", t3);
      }
      function a2(t3) {
        c(n2, r2, s2, o2, a2, "throw", t3);
      }
      o2(void 0);
    }));
  };
}
function f() {
  return f = Object.assign ? Object.assign.bind() : function(t2) {
    for (var e2 = 1; arguments.length > e2; e2++) {
      var i2 = arguments[e2];
      for (var r2 in i2) ({}).hasOwnProperty.call(i2, r2) && (t2[r2] = i2[r2]);
    }
    return t2;
  }, f.apply(null, arguments);
}
function _(t2, e2) {
  if (null == t2) return {};
  var i2 = {};
  for (var r2 in t2) if ({}.hasOwnProperty.call(t2, r2)) {
    if (-1 !== e2.indexOf(r2)) continue;
    i2[r2] = t2[r2];
  }
  return i2;
}
var g, m = (function(t2) {
  return t2.GZipJS = "gzip-js", t2.Base64 = "base64", t2;
})({}), b = ["$snapshot", "$pageview", "$pageleave", "$set", "survey dismissed", "survey sent", "survey shown", "$identify", "$groupidentify", "$create_alias", "$$client_ingestion_warning", "$web_experiment_applied", "$feature_enrollment_update", "$feature_flag_called"], y = "NativeGzipValidationError", w = (t2) => t2.length >= 2 && 31 === t2[0] && 139 === t2[1], x = (t2) => !(!t2 || "object" != typeof t2) && "NotReadableError" === ("name" in t2 ? String(t2.name) : ""), E = (t2) => {
  var e2 = new Error("Native gzip produced invalid output: " + t2);
  throw e2.name = y, e2;
}, S = (function() {
  var t2 = p((function* (t3, e2) {
    18 > t3.size && E("too-short");
    var i2 = new Uint8Array(yield t3.slice(0, 10).arrayBuffer());
    w(i2) && 8 === i2[2] || E("invalid-header");
    var r2 = new DataView(yield t3.slice(t3.size - 8).arrayBuffer());
    r2.getUint32(0, true) !== ((t4) => {
      for (var e3 = (() => {
        if (g) return g;
        g = [];
        for (var t5 = 0; 256 > t5; t5++) {
          for (var e4 = t5, i4 = 0; 8 > i4; i4++) e4 = 1 & e4 ? 3988292384 ^ e4 >>> 1 : e4 >>> 1;
          g[t5] = e4 >>> 0;
        }
        return g;
      })(), i3 = 4294967295, r3 = 0; t4.length > r3; r3++) i3 = e3[255 & (i3 ^ t4[r3])] ^ i3 >>> 8;
      return (4294967295 ^ i3) >>> 0;
    })(e2) && E("invalid-crc");
    var s2 = e2.length >>> 0;
    r2.getUint32(4, true) !== s2 && E("invalid-size");
  }));
  return function(e2, i2) {
    return t2.apply(this, arguments);
  };
})();
function T() {
  return T = p((function* (t2, e2, i2) {
    void 0 === e2 && (e2 = true);
    try {
      var r2 = new TextEncoder().encode(t2), s2 = new CompressionStream("gzip"), n2 = s2.writable.getWriter(), o2 = n2.write(r2).then((() => n2.close())).catch((function() {
        var t3 = p((function* (t4) {
          try {
            yield n2.abort(t4);
          } catch (t5) {
          }
          throw t4;
        }));
        return function(e3) {
          return t3.apply(this, arguments);
        };
      })()), a2 = new Response(s2.readable).blob(), [l2] = yield Promise.all([a2, o2]);
      return yield S(l2, r2), l2;
    } catch (t3) {
      if (null != i2 && i2.rethrow) throw t3;
      return e2 && console.error("Failed to gzip compress data", t3), null;
    }
  })), T.apply(this, arguments);
}
var k = ["amazonbot", "amazonproductbot", "app.hypefactors.com", "applebot", "archive.org_bot", "awariobot", "backlinksextendedbot", "baiduspider", "bingbot", "bingpreview", "chrome-lighthouse", "dataforseobot", "deepscan", "duckduckbot", "facebookexternal", "facebookcatalog", "http://yandex.com/bots", "hubspot", "ia_archiver", "leikibot", "linkedinbot", "meta-externalagent", "mj12bot", "msnbot", "nessus", "petalbot", "pinterest", "prerender", "rogerbot", "screaming frog", "sebot-wa", "sitebulb", "slackbot", "slurp", "trendictionbot", "turnitin", "twitterbot", "vercel-screenshot", "vercelbot", "yahoo! slurp", "yandexbot", "zoombot", "bot.htm", "bot.php", "(bot;", "bot/", "crawler", "ahrefsbot", "ahrefssiteaudit", "semrushbot", "siteauditbot", "splitsignalbot", "gptbot", "oai-searchbot", "chatgpt-user", "perplexitybot", "better uptime bot", "sentryuptimebot", "uptimerobot", "headlesschrome", "cypress", "google-hoteladsverifier", "adsbot-google", "apis-google", "duplexweb-google", "feedfetcher-google", "google favicon", "google web preview", "google-read-aloud", "googlebot", "googleother", "google-cloudvertexbot", "googleweblight", "mediapartners-google", "storebot-google", "google-inspectiontool", "bytespider"], R = function(t2, e2) {
  if (void 0 === e2 && (e2 = []), !t2) return false;
  var i2 = t2.toLowerCase();
  return k.concat(e2).some(((t3) => {
    var e3 = t3.toLowerCase();
    return -1 !== i2.indexOf(e3);
  }));
};
function P(t2, e2) {
  return -1 !== t2.indexOf(e2);
}
var O = function(t2) {
  return t2.trim();
}, I = function(t2) {
  return t2.replace(/^\$/, "");
}, C = Object.prototype, A = C.hasOwnProperty, F = C.toString, M = Array.isArray || function(t2) {
  return "[object Array]" === F.call(t2);
}, D = (t2) => "function" == typeof t2, U = (t2) => t2 === Object(t2) && !M(t2), L = (t2) => {
  if (U(t2)) {
    for (var e2 in t2) if (A.call(t2, e2)) return false;
    return true;
  }
  return false;
}, N = (t2) => void 0 === t2, j = (t2) => "[object String]" == F.call(t2), z = (t2) => j(t2) && 0 === t2.trim().length, B = (t2) => null === t2, H = (t2) => N(t2) || B(t2), q = (t2) => "[object Number]" == F.call(t2) && t2 == t2, V = (t2) => q(t2) && t2 > 0, W = (t2) => "[object Boolean]" === F.call(t2), G = (t2) => t2 instanceof FormData, Y = (t2) => P(b, t2);
function J(t2) {
  return null === t2 || "object" != typeof t2;
}
function K(t2, e2) {
  return {}.toString.call(t2) === "[object " + e2 + "]";
}
function X(t2) {
  return "undefined" != typeof Event && (function(t3, e2) {
    try {
      return t3 instanceof e2;
    } catch (t4) {
      return false;
    }
  })(t2, Event);
}
var Q = [true, "true", 1, "1", "yes"], Z = (t2) => P(Q, t2), tt = [false, "false", 0, "0", "no"];
function et(t2, e2, i2, r2, s2) {
  return e2 > i2 && (r2.warn("min cannot be greater than max."), e2 = i2), q(t2) ? t2 > i2 ? (r2.warn(" cannot be  greater than max: " + i2 + ". Using max value instead."), i2) : e2 > t2 ? (r2.warn(" cannot be less than min: " + e2 + ". Using min value instead."), e2) : t2 : (r2.warn(" must be a number. using max or fallback. max: " + i2 + ", fallback: " + s2), et(s2 || i2, e2, i2, r2));
}
class it {
  constructor(t2) {
    this.$t = {}, this.zt = t2.zt, this.Zt = et(t2.bucketSize, 0, 100, t2.Gt), this.Qt = et(t2.refillRate, 0, this.Zt, t2.Gt), this.Jt = et(t2.refillInterval, 0, 864e5, t2.Gt);
  }
  Kt(t2, e2) {
    var i2 = Math.floor((e2 - t2.lastAccess) / this.Jt);
    i2 > 0 && (t2.tokens = Math.min(t2.tokens + i2 * this.Qt, this.Zt), t2.lastAccess = t2.lastAccess + i2 * this.Jt);
  }
  consumeRateLimit(t2) {
    var e2, i2 = Date.now(), r2 = String(t2), s2 = this.$t[r2];
    return s2 ? this.Kt(s2, i2) : this.$t[r2] = s2 = { tokens: this.Zt, lastAccess: i2 }, 0 === s2.tokens || (s2.tokens--, 0 === s2.tokens && (null == (e2 = this.zt) || e2.call(this, t2)), 0 === s2.tokens);
  }
  stop() {
    this.$t = {};
  }
}
var rt, st, nt, ot = "Mobile", at = "iOS", lt = "Android", ut = "Tablet", ht = lt + " " + ut, dt = "iPad", vt = "Apple", ct = vt + " Watch", pt = "Safari", ft = "BlackBerry", _t = "Samsung", gt = _t + "Browser", mt = _t + " Internet", bt = "Chrome", yt = bt + " OS", wt = bt + " " + at, xt = "Internet Explorer", Et = xt + " " + ot, St = "Opera", $t = St + " Mini", Tt = "Edge", kt = "Microsoft " + Tt, Rt = "Firefox", Pt = Rt + " " + at, Ot = "Nintendo", It = "PlayStation", Ct = "Xbox", At = lt + " " + ot, Ft = ot + " " + pt, Mt = "Windows", Dt = Mt + " Phone", Ut = "Nokia", Lt = "Ouya", Nt = "Generic", jt = Nt + " " + ot.toLowerCase(), zt = Nt + " " + ut.toLowerCase(), Bt = "Konqueror", Ht = "Oculus Browser", qt = "(\\d+(\\.\\d+)?)", Vt = new RegExp("Version/" + qt), Wt = new RegExp(Ct, "i"), Gt = new RegExp(It + " \\w+", "i"), Yt = new RegExp(Ot + " \\w+", "i"), Jt = new RegExp(ft + "|PlayBook|BB10", "i"), Kt = { "NT3.51": "NT 3.11", "NT4.0": "NT 4.0", "5.0": "2000", 5.1: "XP", 5.2: "XP", "6.0": "Vista", 6.1: "7", 6.2: "8", 6.3: "8.1", 6.4: "10", "10.0": "10" }, Xt = function(t2, e2) {
  return e2 = e2 || "", P(t2, " OPR/") && P(t2, "Mini") ? $t : P(t2, " OPR/") ? St : Jt.test(t2) ? ft : P(t2, "IE" + ot) || P(t2, "WPDesktop") ? Et : P(t2, "OculusBrowser") ? Ht : P(t2, gt) ? mt : P(t2, Tt) || P(t2, "Edg/") ? kt : P(t2, "FBIOS") ? "Facebook " + ot : P(t2, "UCWEB") || P(t2, "UCBrowser") ? "UC Browser" : P(t2, "CriOS") ? wt : P(t2, "CrMo") || P(t2, bt) ? bt : P(t2, lt) && P(t2, pt) ? At : P(t2, "FxiOS") ? Pt : P(t2.toLowerCase(), Bt.toLowerCase()) ? Bt : ((t3, e3) => e3 && P(e3, vt) || (function(t4) {
    return P(t4, pt) && !P(t4, bt) && !P(t4, lt);
  })(t3))(t2, e2) ? P(t2, ot) ? Ft : pt : P(t2, Rt) ? Rt : P(t2, "MSIE") || P(t2, "Trident/") ? xt : P(t2, "Gecko") ? Rt : "";
}, Qt = { [Et]: [new RegExp("rv:" + qt)], [kt]: [new RegExp(Tt + "?\\/" + qt)], [bt]: [new RegExp("(" + bt + "|CrMo)\\/" + qt)], [wt]: [new RegExp("CriOS\\/" + qt)], "UC Browser": [new RegExp("(UCBrowser|UCWEB)\\/" + qt)], [pt]: [Vt], [Ft]: [Vt], [St]: [new RegExp("(Opera|OPR)\\/" + qt)], [Rt]: [new RegExp(Rt + "\\/" + qt)], [Pt]: [new RegExp("FxiOS\\/" + qt)], [Bt]: [new RegExp("Konqueror[:/]?" + qt, "i")], [ft]: [new RegExp(ft + " " + qt), Vt], [At]: [new RegExp("android\\s" + qt, "i")], [mt]: [new RegExp(gt + "\\/" + qt)], [Ht]: [new RegExp("OculusBrowser\\/" + qt)], [xt]: [new RegExp("(rv:|MSIE )" + qt)], Mozilla: [new RegExp("rv:" + qt)] }, Zt = function(t2, e2) {
  var i2 = Xt(t2, e2), r2 = Qt[i2];
  if (N(r2)) return null;
  for (var s2 = 0; r2.length > s2; s2++) {
    var n2 = t2.match(r2[s2]);
    if (n2) return parseFloat(n2[n2.length - 2]);
  }
  return null;
}, te = [[new RegExp(Ct + "; " + Ct + " (.*?)[);]", "i"), (t2) => [Ct, t2 && t2[1] || ""]], [new RegExp(Ot, "i"), [Ot, ""]], [new RegExp(It, "i"), [It, ""]], [Jt, [ft, ""]], [new RegExp(Mt, "i"), (t2, e2) => {
  if (/Phone/.test(e2) || /WPDesktop/.test(e2)) return [Dt, ""];
  if (new RegExp(ot).test(e2) && !/IEMobile\b/.test(e2)) return [Mt + " " + ot, ""];
  var i2 = /Windows NT ([0-9.]+)/i.exec(e2);
  if (i2 && i2[1]) {
    var r2 = Kt[i2[1]] || "";
    return /arm/i.test(e2) && (r2 = "RT"), [Mt, r2];
  }
  return [Mt, ""];
}], [/((iPhone|iPad|iPod).*?OS (\d+)_(\d+)_?(\d+)?|iPhone)/, (t2) => t2 && t2[3] ? [at, [t2[3], t2[4], t2[5] || "0"].join(".")] : [at, ""]], [/(watch.*\/(\d+\.\d+\.\d+)|watch os,(\d+\.\d+),)/i, (t2) => {
  var e2 = "";
  return t2 && t2.length >= 3 && (e2 = N(t2[2]) ? t2[3] : t2[2]), ["watchOS", e2];
}], [new RegExp("(" + lt + " (\\d+)\\.(\\d+)\\.?(\\d+)?|" + lt + ")", "i"), (t2) => t2 && t2[2] ? [lt, [t2[2], t2[3], t2[4] || "0"].join(".")] : [lt, ""]], [/Mac OS X (\d+)[_.](\d+)[_.]?(\d+)?/i, (t2) => {
  var e2 = ["Mac OS X", ""];
  return t2 && t2[1] && (e2[1] = [t2[1], t2[2], t2[3] || "0"].join(".")), e2;
}], [/Mac/i, ["Mac OS X", ""]], [/CrOS/, [yt, ""]], [/Linux|debian/i, ["Linux", ""]]], ee = function(t2) {
  return Yt.test(t2) ? Ot : Gt.test(t2) ? It : Wt.test(t2) ? Ct : new RegExp(Lt, "i").test(t2) ? Lt : new RegExp("(" + Dt + "|WPDesktop)", "i").test(t2) ? Dt : /iPad/.test(t2) ? dt : /iPod/.test(t2) ? "iPod Touch" : /iPhone/.test(t2) ? "iPhone" : /(watch)(?: ?os[,/]|\d,\d\/)[\d.]+/i.test(t2) ? ct : Jt.test(t2) ? ft : /(kobo)\s(ereader|touch)/i.test(t2) ? "Kobo" : new RegExp(Ut, "i").test(t2) ? Ut : /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i.test(t2) || /(kf[a-z]+)( bui|\)).+silk\//i.test(t2) ? "Kindle Fire" : /(Android|ZTE)/i.test(t2) ? new RegExp(ot).test(t2) && !/(9138B|TB782B|Nexus [97]|pixel c|HUAWEISHT|BTV|noble nook|smart ultra 6)/i.test(t2) || /pixel[\daxl ]{1,6}/i.test(t2) && !/pixel c/i.test(t2) || /(huaweimed-al00|tah-|APA|SM-G92|i980|zte|U304AA)/i.test(t2) || /lmy47v/i.test(t2) && !/QTAQZ3/i.test(t2) ? lt : ht : new RegExp("(pda|" + ot + ")", "i").test(t2) ? jt : new RegExp(ut, "i").test(t2) && !new RegExp(ut + " pc", "i").test(t2) ? zt : "";
}, ie = (t2) => t2 instanceof Error, re = { trace: { text: "TRACE", number: 1 }, debug: { text: "DEBUG", number: 5 }, info: { text: "INFO", number: 9 }, warn: { text: "WARN", number: 13 }, error: { text: "ERROR", number: 17 }, fatal: { text: "FATAL", number: 21 } }, se = re.info;
function ne(t2) {
  if (W(t2)) return { boolValue: t2 };
  if ("number" == typeof t2) return Number.isFinite(t2) ? Number.isInteger(t2) ? { intValue: t2 } : { doubleValue: t2 } : { stringValue: String(t2) };
  if ("string" == typeof t2) return { stringValue: t2 };
  if (M(t2)) return { arrayValue: { values: t2.map(((t3) => ne(t3))) } };
  try {
    return { stringValue: JSON.stringify(t2) };
  } catch (e2) {
    return { stringValue: String(t2) };
  }
}
function oe(t2) {
  var e2 = [];
  for (var i2 in t2) {
    var r2 = t2[i2];
    B(r2) || N(r2) || e2.push({ key: i2, value: ne(r2) });
  }
  return e2;
}
function ae(t2) {
  var e2 = globalThis._posthogChunkIds;
  if (e2) {
    var i2 = Object.keys(e2);
    return nt && i2.length === st || (st = i2.length, nt = i2.reduce(((i3, r2) => {
      rt || (rt = {});
      var s2 = rt[r2];
      if (s2) i3[s2[0]] = s2[1];
      else for (var n2 = t2(r2), o2 = n2.length - 1; o2 >= 0; o2--) {
        var a2 = n2[o2], l2 = null == a2 ? void 0 : a2.filename, u2 = e2[r2];
        if (l2 && u2) {
          i3[l2] = u2, rt[r2] = [l2, u2];
          break;
        }
      }
      return i3;
    }), {})), nt;
  }
}
class le {
  constructor(t2, e2, i2) {
    void 0 === i2 && (i2 = []), this.coercers = t2, this.stackParser = e2, this.modifiers = i2;
  }
  buildFromUnknown(t2, e2) {
    void 0 === e2 && (e2 = {});
    var i2 = e2 && e2.mechanism || { handled: true, type: "generic" }, r2 = this.buildCoercingContext(i2, e2, 0).apply(t2), s2 = this.buildParsingContext(e2), n2 = this.parseStacktrace(r2, s2);
    return { $exception_list: this.convertToExceptionList(n2, i2), $exception_level: "error" };
  }
  modifyFrames(t2) {
    var e2 = this;
    return p((function* () {
      for (var i2 of t2) i2.stacktrace && i2.stacktrace.frames && M(i2.stacktrace.frames) && (i2.stacktrace.frames = yield e2.applyModifiers(i2.stacktrace.frames));
      return t2;
    }))();
  }
  coerceFallback(t2) {
    var e2;
    return { type: "Error", value: "Unknown error", stack: null == (e2 = t2.syntheticException) ? void 0 : e2.stack, synthetic: true };
  }
  parseStacktrace(t2, e2) {
    var i2, r2;
    return null != t2.cause && (i2 = this.parseStacktrace(t2.cause, e2)), "" != t2.stack && null != t2.stack && (r2 = this.applyChunkIds(this.stackParser(t2.stack, t2.synthetic ? e2.skipFirstLines : 0), e2.chunkIdMap)), f({}, t2, { cause: i2, stack: r2 });
  }
  applyChunkIds(t2, e2) {
    return t2.map(((t3) => (t3.filename && e2 && (t3.chunk_id = e2[t3.filename]), t3)));
  }
  applyCoercers(t2, e2) {
    for (var i2 of this.coercers) if (i2.match(t2)) return i2.coerce(t2, e2);
    return this.coerceFallback(e2);
  }
  applyModifiers(t2) {
    var e2 = this;
    return p((function* () {
      var i2 = t2;
      for (var r2 of e2.modifiers) i2 = yield r2(i2);
      return i2;
    }))();
  }
  convertToExceptionList(t2, e2) {
    var i2, r2, s2, n2 = { type: t2.type, value: t2.value, mechanism: { type: null !== (i2 = e2.type) && void 0 !== i2 ? i2 : "generic", handled: null === (r2 = e2.handled) || void 0 === r2 || r2, synthetic: null !== (s2 = t2.synthetic) && void 0 !== s2 && s2 } };
    t2.stack && (n2.stacktrace = { type: "raw", frames: t2.stack });
    var o2 = [n2];
    return null != t2.cause && o2.push(...this.convertToExceptionList(t2.cause, f({}, e2, { handled: true }))), o2;
  }
  buildParsingContext(t2) {
    var e2;
    return { chunkIdMap: ae(this.stackParser), skipFirstLines: null !== (e2 = t2.skipFirstLines) && void 0 !== e2 ? e2 : 1 };
  }
  buildCoercingContext(t2, e2, i2) {
    void 0 === i2 && (i2 = 0);
    var r2 = (i3, r3) => {
      if (4 >= r3) {
        var s2 = this.buildCoercingContext(t2, e2, r3);
        return this.applyCoercers(i3, s2);
      }
    };
    return f({}, e2, { syntheticException: 0 == i2 ? e2.syntheticException : void 0, mechanism: t2, apply: (t3) => r2(t3, i2), next: (t3) => r2(t3, i2 + 1) });
  }
}
var ue = "?";
function he(t2, e2, i2, r2, s2) {
  var n2 = { platform: t2, filename: e2, function: "<anonymous>" === i2 ? ue : i2, in_app: true };
  return N(r2) || (n2.lineno = r2), N(s2) || (n2.colno = s2), n2;
}
var de = (t2, e2) => {
  var i2 = -1 !== t2.indexOf("safari-extension"), r2 = -1 !== t2.indexOf("safari-web-extension");
  return i2 || r2 ? [-1 !== t2.indexOf("@") ? t2.split("@")[0] : ue, i2 ? "safari-extension:" + e2 : "safari-web-extension:" + e2] : [t2, e2];
}, ve = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i, ce = /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i, pe = /\((\S*)(?::(\d+))(?::(\d+))\)/, fe = (t2, e2) => {
  var i2 = ve.exec(t2);
  if (i2) {
    var [, r2, s2, n2] = i2;
    return he(e2, r2, ue, +s2, +n2);
  }
  var o2 = ce.exec(t2);
  if (o2) {
    if (o2[2] && 0 === o2[2].indexOf("eval")) {
      var a2 = pe.exec(o2[2]);
      a2 && (o2[2] = a2[1], o2[3] = a2[2], o2[4] = a2[3]);
    }
    var [l2, u2] = de(o2[1] || ue, o2[2]);
    return he(e2, u2, l2, o2[3] ? +o2[3] : void 0, o2[4] ? +o2[4] : void 0);
  }
}, _e = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i, ge = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i, me = (t2, e2) => {
  var i2 = _e.exec(t2);
  if (i2) {
    if (i2[3] && i2[3].indexOf(" > eval") > -1) {
      var r2 = ge.exec(i2[3]);
      r2 && (i2[1] = i2[1] || "eval", i2[3] = r2[1], i2[4] = r2[2], i2[5] = "");
    }
    var s2 = i2[3], n2 = i2[1] || ue;
    return [n2, s2] = de(n2, s2), he(e2, s2, n2, i2[4] ? +i2[4] : void 0, i2[5] ? +i2[5] : void 0);
  }
}, be = /\(error: (.*)\)/;
class ye {
  match(t2) {
    return this.isDOMException(t2) || this.isDOMError(t2);
  }
  coerce(t2, e2) {
    var i2 = j(t2.stack);
    return { type: this.getType(t2), value: this.getValue(t2), stack: i2 ? t2.stack : void 0, cause: t2.cause ? e2.next(t2.cause) : void 0, synthetic: false };
  }
  getType(t2) {
    return this.isDOMError(t2) ? "DOMError" : "DOMException";
  }
  getValue(t2) {
    var e2 = t2.name || (this.isDOMError(t2) ? "DOMError" : "DOMException");
    return t2.message ? e2 + ": " + t2.message : e2;
  }
  isDOMException(t2) {
    return K(t2, "DOMException");
  }
  isDOMError(t2) {
    return K(t2, "DOMError");
  }
}
class we {
  match(t2) {
    return ((t3) => t3 instanceof Error)(t2);
  }
  coerce(t2, e2) {
    return { type: this.getType(t2), value: this.getMessage(t2, e2), stack: this.getStack(t2), cause: t2.cause ? e2.next(t2.cause) : void 0, synthetic: false };
  }
  getType(t2) {
    return t2.name || t2.constructor.name;
  }
  getMessage(t2, e2) {
    var i2 = t2.message;
    return String(i2.error && "string" == typeof i2.error.message ? i2.error.message : i2);
  }
  getStack(t2) {
    return t2.stacktrace || t2.stack || void 0;
  }
}
class xe {
  constructor() {
  }
  match(t2) {
    return K(t2, "ErrorEvent") && null != t2.error;
  }
  coerce(t2, e2) {
    var i2;
    return e2.apply(t2.error) || { type: "ErrorEvent", value: t2.message, stack: null == (i2 = e2.syntheticException) ? void 0 : i2.stack, synthetic: true };
  }
}
var Ee = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/i;
class Se {
  match(t2) {
    return "string" == typeof t2;
  }
  coerce(t2, e2) {
    var i2, [r2, s2] = this.getInfos(t2);
    return { type: null != r2 ? r2 : "Error", value: null != s2 ? s2 : t2, stack: null == (i2 = e2.syntheticException) ? void 0 : i2.stack, synthetic: true };
  }
  getInfos(t2) {
    var e2 = "Error", i2 = t2, r2 = t2.match(Ee);
    return r2 && (e2 = r2[1], i2 = r2[2]), [e2, i2];
  }
}
var $e = ["fatal", "error", "warning", "log", "info", "debug"];
function Te(t2, e2) {
  void 0 === e2 && (e2 = 40);
  var i2 = Object.keys(t2);
  if (i2.sort(), !i2.length) return "[object has no keys]";
  for (var r2 = i2.length; r2 > 0; r2--) {
    var s2 = i2.slice(0, r2).join(", ");
    if (e2 >= s2.length) return r2 === i2.length ? s2 : s2.length > e2 ? s2.slice(0, e2) + "..." : s2;
  }
  return "";
}
class ke {
  match(t2) {
    return "object" == typeof t2 && null !== t2;
  }
  coerce(t2, e2) {
    var i2, r2 = this.getErrorPropertyFromObject(t2);
    return r2 ? e2.apply(r2) : { type: this.getType(t2), value: this.getValue(t2), stack: null == (i2 = e2.syntheticException) ? void 0 : i2.stack, level: this.isSeverityLevel(t2.level) ? t2.level : "error", synthetic: true };
  }
  getType(t2) {
    return X(t2) ? t2.constructor.name : "Error";
  }
  getValue(t2) {
    if ("name" in t2 && "string" == typeof t2.name) {
      var e2 = "'" + t2.name + "' captured as exception";
      return "message" in t2 && "string" == typeof t2.message && (e2 += " with message: '" + t2.message + "'"), e2;
    }
    if ("message" in t2 && "string" == typeof t2.message) return t2.message;
    var i2 = this.getObjectClassName(t2);
    return (i2 && "Object" !== i2 ? "'" + i2 + "'" : "Object") + " captured as exception with keys: " + Te(t2);
  }
  isSeverityLevel(t2) {
    return j(t2) && !z(t2) && $e.indexOf(t2) >= 0;
  }
  getErrorPropertyFromObject(t2) {
    for (var e2 in t2) if ({}.hasOwnProperty.call(t2, e2)) {
      var i2 = t2[e2];
      if (ie(i2)) return i2;
    }
  }
  getObjectClassName(t2) {
    try {
      var e2 = Object.getPrototypeOf(t2);
      return e2 ? e2.constructor.name : void 0;
    } catch (t3) {
      return;
    }
  }
}
class Re {
  match(t2) {
    return X(t2);
  }
  coerce(t2, e2) {
    var i2, r2 = t2.constructor.name;
    return { type: r2, value: r2 + " captured as exception with keys: " + Te(t2), stack: null == (i2 = e2.syntheticException) ? void 0 : i2.stack, synthetic: true };
  }
}
class Pe {
  match(t2) {
    return J(t2);
  }
  coerce(t2, e2) {
    var i2;
    return { type: "Error", value: "Primitive value captured as exception: " + String(t2), stack: null == (i2 = e2.syntheticException) ? void 0 : i2.stack, synthetic: true };
  }
}
class Oe {
  match(t2) {
    return K(t2, "PromiseRejectionEvent") || this.isCustomEventWrappingRejection(t2);
  }
  isCustomEventWrappingRejection(t2) {
    if (!X(t2)) return false;
    try {
      var e2 = t2.detail;
      return null != e2 && "object" == typeof e2 && "reason" in e2;
    } catch (t3) {
      return false;
    }
  }
  coerce(t2, e2) {
    var i2, r2 = this.getUnhandledRejectionReason(t2);
    return J(r2) ? { type: "UnhandledRejection", value: "Non-Error promise rejection captured with value: " + String(r2), stack: null == (i2 = e2.syntheticException) ? void 0 : i2.stack, synthetic: true } : e2.apply(r2);
  }
  getUnhandledRejectionReason(t2) {
    try {
      if ("reason" in t2) return t2.reason;
      if ("detail" in t2 && null != t2.detail && "object" == typeof t2.detail && "reason" in t2.detail) return t2.detail.reason;
    } catch (t3) {
    }
    return t2;
  }
}
var Ie = "$message", Ce = "$timestamp", Ae = /* @__PURE__ */ new Set([Ie, Ce]), Fe = { enabled: true, max_bytes: 32768 };
function Me(t2) {
  var e2;
  return t2 ? { enabled: null !== (e2 = t2.enabled) && void 0 !== e2 ? e2 : Fe.enabled, max_bytes: Ue(t2.max_bytes, Fe.max_bytes) } : f({}, Fe);
}
class De {
  constructor(t2) {
    this.Yt = [], this.Xt = 0, this.qt = Me(t2);
  }
  setConfig(t2) {
    this.qt = Me(t2), this.tr();
  }
  add(t2) {
    var e2 = (function(t3) {
      var e3 = (function(t4) {
        var e4 = /* @__PURE__ */ new WeakSet();
        try {
          return JSON.stringify(t4, ((t5, i4) => {
            if ("bigint" == typeof i4) return i4.toString();
            if ("function" != typeof i4 && "symbol" != typeof i4) {
              if (i4 instanceof Date) return i4.toISOString();
              if (i4 instanceof Error) return { name: i4.name, message: i4.message, stack: i4.stack };
              if (i4 && "object" == typeof i4) {
                if (e4.has(i4)) return "[Circular]";
                e4.add(i4);
              }
              return i4;
            }
          }));
        } catch (t5) {
          return;
        }
      })(t3);
      if (e3) try {
        var i3 = JSON.parse(e3);
        if (!U(i3)) return;
        var r2 = i3, s2 = r2[Ie], n2 = r2[Ce];
        if (!j(s2) || 0 === s2.trim().length) return;
        if (!j(n2) && !q(n2)) return;
        return { step: r2, json: e3 };
      } catch (t4) {
        return;
      }
    })(t2);
    if (e2) {
      var i2 = (function(t3) {
        if ("undefined" != typeof TextEncoder) return new TextEncoder().encode(t3).length;
        for (var e3 = encodeURIComponent(t3), i3 = 0, r2 = 0; e3.length > r2; r2++) "%" === e3[r2] ? (i3 += 1, r2 += 2) : i3 += 1;
        return i3;
      })(e2.json);
      i2 > this.qt.max_bytes || (this.Yt.push({ step: e2.step, bytes: i2 }), this.Xt += i2, this.tr());
    }
  }
  getAttachable() {
    return this.Yt.map(((t2) => t2.step));
  }
  clear() {
    this.Yt = [], this.Xt = 0;
  }
  size() {
    return this.Yt.length;
  }
  tr() {
    for (; this.Xt > this.qt.max_bytes && this.Yt.length > 0; ) {
      var t2 = this.Yt.shift();
      t2 && (this.Xt -= t2.bytes);
    }
  }
}
function Ue(t2, e2) {
  if (!q(t2) || t2 === 1 / 0 || t2 === -1 / 0) return e2;
  var i2 = Math.floor(t2);
  return 0 > i2 ? e2 : i2;
}
var Le = function(e2, i2) {
  var { debugEnabled: r2 } = void 0 === i2 ? {} : i2, s2 = { k(i3) {
    if (t && (v.DEBUG || h.POSTHOG_DEBUG || r2) && !N(t.console) && t.console) {
      for (var s3 = ("__rrweb_original__" in t.console[i3]) ? t.console[i3].__rrweb_original__ : t.console[i3], n2 = arguments.length, o2 = new Array(n2 > 1 ? n2 - 1 : 0), a2 = 1; n2 > a2; a2++) o2[a2 - 1] = arguments[a2];
      s3(e2, ...o2);
    }
  }, debug() {
    for (var t2 = arguments.length, e3 = new Array(t2), i3 = 0; t2 > i3; i3++) e3[i3] = arguments[i3];
    s2.k("debug", ...e3);
  }, info() {
    for (var t2 = arguments.length, e3 = new Array(t2), i3 = 0; t2 > i3; i3++) e3[i3] = arguments[i3];
    s2.k("log", ...e3);
  }, warn() {
    for (var t2 = arguments.length, e3 = new Array(t2), i3 = 0; t2 > i3; i3++) e3[i3] = arguments[i3];
    s2.k("warn", ...e3);
  }, error() {
    for (var t2 = arguments.length, e3 = new Array(t2), i3 = 0; t2 > i3; i3++) e3[i3] = arguments[i3];
    s2.k("error", ...e3);
  }, critical() {
    for (var t2 = arguments.length, i3 = new Array(t2), r3 = 0; t2 > r3; r3++) i3[r3] = arguments[r3];
    console.error(e2, ...i3);
  }, uninitializedWarning(t2) {
    s2.error("You must initialize PostHog before calling " + t2);
  }, createLogger: (t2, i3) => Le(e2 + " " + t2, i3) };
  return s2;
}, Ne = Le("[PostHog.js]"), je = Ne.createLogger, ze = je("[ExternalScriptsLoader]"), Be = (t2, e2, i2) => {
  if (t2.config.disable_external_dependency_loading) return ze.warn(e2 + " was requested but loading of external scripts is disabled."), i2("Loading of external scripts is disabled");
  var s2 = null == r ? void 0 : r.querySelectorAll("script");
  if (s2) {
    for (var n2, o2 = function() {
      if (s2[a2].src === e2) {
        var t3 = s2[a2];
        return t3.__posthog_loading_callback_fired ? { v: i2() } : (t3.addEventListener("load", ((e3) => {
          t3.__posthog_loading_callback_fired = true, i2(void 0, e3);
        })), t3.onerror = (t4) => i2(t4), { v: void 0 });
      }
    }, a2 = 0; s2.length > a2; a2++) if (n2 = o2()) return n2.v;
  }
  var l2 = () => {
    if (!r) return i2("document not found");
    var s3 = r.createElement("script");
    if (s3.type = "text/javascript", s3.crossOrigin = "anonymous", s3.src = e2, s3.onload = (t3) => {
      s3.__posthog_loading_callback_fired = true, i2(void 0, t3);
    }, s3.onerror = (t3) => i2(t3), t2.config.prepare_external_dependency_script && (s3 = t2.config.prepare_external_dependency_script(s3)), !s3) return i2("prepare_external_dependency_script returned null");
    if ("head" === t2.config.external_scripts_inject_target) r.head.appendChild(s3);
    else {
      var n3, o3 = r.querySelectorAll("body > script");
      o3.length > 0 ? null == (n3 = o3[0].parentNode) || n3.insertBefore(s3, o3[0]) : r.body.appendChild(s3);
    }
  };
  null != r && r.body ? l2() : null == r || r.addEventListener("DOMContentLoaded", l2);
};
h.__PosthogExtensions__ = h.__PosthogExtensions__ || {}, h.__PosthogExtensions__.loadExternalDependency = (t2, e2, i2) => {
  if ("remote-config" !== e2) {
    var r2;
    if (t2.config.__preview_external_dependency_versioned_paths) r2 = t2.requestRouter.endpointFor("assets", "/static/" + t2.version + "/" + e2 + ".js");
    else {
      var s2 = "/static/" + e2 + ".js?v=" + t2.version;
      if ("toolbar" === e2) {
        var n2 = 3e5;
        s2 = s2 + "&t=" + Math.floor(Date.now() / n2) * n2;
      }
      r2 = t2.requestRouter.endpointFor("assets", s2);
    }
    Be(t2, r2, i2);
  } else {
    var o2 = t2.requestRouter.endpointFor("assets", "/array/" + t2.config.token + "/config.js");
    Be(t2, o2, i2);
  }
}, h.__PosthogExtensions__.loadSiteApp = (t2, e2, i2) => {
  var r2 = t2.requestRouter.endpointFor("api", e2);
  Be(t2, r2, i2);
};
var He = "$people_distinct_id", qe = "$device_id", Ve = "__alias", We = "__timers", Ge = "$autocapture_disabled_server_side", Ye = "$heatmaps_enabled_server_side", Je = "$exception_capture_enabled_server_side", Ke = "$error_tracking_suppression_rules", Xe = "$error_tracking_capture_extension_exceptions", Qe = "$web_vitals_enabled_server_side", Ze = "$dead_clicks_enabled_server_side", ti = "$product_tours_enabled_server_side", ei = "$web_vitals_allowed_metrics", ii = "$session_recording_remote_config", ri = "$replay_override_sampling", si = "$replay_override_linked_flag", ni = "$replay_override_url_trigger", oi = "$replay_override_event_trigger", ai = "$sesid", li = "$session_is_sampled", ui = "$enabled_feature_flags", hi = "$active_feature_flags", di = "$early_access_features", vi = "$feature_flag_details", ci = "$feature_flag_payloads", pi = "$feature_flag_request_id", fi = "$override_feature_flags", _i = "$override_feature_flag_payloads", gi = "$stored_person_properties", mi = "$stored_group_properties", bi = "$surveys", yi = "$surveys_activated", wi = "ph_product_tours", xi = "$flag_call_reported", Ei = "$flag_call_reported_session_id", Si = "$feature_flag_errors", $i = "$feature_flag_evaluated_at", Ti = "$user_state", ki = "$client_session_props", Ri = "$capture_rate_limit", Pi = "$initial_campaign_params", Oi = "$initial_referrer_info", Ii = "$initial_person_info", Ci = "$epp", Ai = "__POSTHOG_TOOLBAR__", Fi = "$posthog_cookieless", Mi = "$sdk_debug_extensions_init_method", Di = "$sdk_debug_extensions_init_time_ms", Ui = "$sdk_debug_recording_script_not_loaded", Li = "PostHog loadExternalDependency extension not found.", Ni = "on_reject", ji = "always", zi = "anonymous", Bi = "identified", Hi = "identified_only", qi = "visibilitychange", Vi = "beforeunload", Wi = "$pageview", Gi = "$pageleave", Yi = "$identify", Ji = "$groupidentify";
function Ki(t2, e2) {
  M(t2) && t2.forEach(e2);
}
function Xi(t2, e2) {
  if (!H(t2)) if (M(t2)) t2.forEach(e2);
  else if (G(t2)) t2.forEach(((t3, i3) => e2(t3, i3)));
  else for (var i2 in t2) A.call(t2, i2) && e2(t2[i2], i2);
}
var Qi = function(t2) {
  for (var e2 = arguments.length, i2 = new Array(e2 > 1 ? e2 - 1 : 0), r2 = 1; e2 > r2; r2++) i2[r2 - 1] = arguments[r2];
  for (var s2 of i2) for (var n2 in s2) void 0 !== s2[n2] && (t2[n2] = s2[n2]);
  return t2;
};
function Zi(t2) {
  for (var e2 = Object.keys(t2), i2 = e2.length, r2 = new Array(i2); i2--; ) r2[i2] = [e2[i2], t2[e2[i2]]];
  return r2;
}
var tr = function(t2) {
  try {
    return t2();
  } catch (t3) {
    return;
  }
}, er = function(t2) {
  return function() {
    try {
      for (var e2 = arguments.length, i2 = new Array(e2), r2 = 0; e2 > r2; r2++) i2[r2] = arguments[r2];
      return t2.apply(this, i2);
    } catch (t3) {
      Ne.critical("Implementation error. Please turn on debug mode and open a ticket on https://app.posthog.com/home#panel=support%3Asupport%3A."), Ne.critical(t3);
    }
  };
}, ir = function(t2) {
  var e2 = {};
  return Xi(t2, (function(t3, i2) {
    (j(t3) && t3.length > 0 || q(t3)) && (e2[i2] = t3);
  })), e2;
};
var rr = ["herokuapp.com", "vercel.app", "netlify.app"];
function sr(t2) {
  var e2 = null == t2 ? void 0 : t2.hostname;
  if (!j(e2)) return false;
  var i2 = e2.split(".").slice(-2).join(".");
  for (var r2 of rr) if (i2 === r2) return false;
  return true;
}
function nr(t2, e2, i2, r2) {
  var { capture: s2 = false, passive: n2 = true } = null != r2 ? r2 : {};
  null == t2 || t2.addEventListener(e2, i2, { capture: s2, passive: n2 });
}
function or(t2) {
  return "ph_toolbar_internal" === t2.name;
}
Math.trunc || (Math.trunc = function(t2) {
  return 0 > t2 ? Math.ceil(t2) : Math.floor(t2);
}), Number.isInteger || (Number.isInteger = function(t2) {
  return q(t2) && isFinite(t2) && Math.floor(t2) === t2;
});
class ar {
  constructor(t2) {
    if (this.bytes = t2, 16 !== t2.length) throw new TypeError("not 128-bit length");
  }
  static fromFieldsV7(t2, e2, i2, r2) {
    if (!Number.isInteger(t2) || !Number.isInteger(e2) || !Number.isInteger(i2) || !Number.isInteger(r2) || 0 > t2 || 0 > e2 || 0 > i2 || 0 > r2 || t2 > 281474976710655 || e2 > 4095 || i2 > 1073741823 || r2 > 4294967295) throw new RangeError("invalid field value");
    var s2 = new Uint8Array(16);
    return s2[0] = t2 / Math.pow(2, 40), s2[1] = t2 / Math.pow(2, 32), s2[2] = t2 / Math.pow(2, 24), s2[3] = t2 / Math.pow(2, 16), s2[4] = t2 / Math.pow(2, 8), s2[5] = t2, s2[6] = 112 | e2 >>> 8, s2[7] = e2, s2[8] = 128 | i2 >>> 24, s2[9] = i2 >>> 16, s2[10] = i2 >>> 8, s2[11] = i2, s2[12] = r2 >>> 24, s2[13] = r2 >>> 16, s2[14] = r2 >>> 8, s2[15] = r2, new ar(s2);
  }
  toString() {
    for (var t2 = "", e2 = 0; this.bytes.length > e2; e2++) t2 = t2 + (this.bytes[e2] >>> 4).toString(16) + (15 & this.bytes[e2]).toString(16), 3 !== e2 && 5 !== e2 && 7 !== e2 && 9 !== e2 || (t2 += "-");
    if (36 !== t2.length) throw new Error("Invalid UUIDv7 was generated");
    return t2;
  }
  clone() {
    return new ar(this.bytes.slice(0));
  }
  equals(t2) {
    return 0 === this.compareTo(t2);
  }
  compareTo(t2) {
    for (var e2 = 0; 16 > e2; e2++) {
      var i2 = this.bytes[e2] - t2.bytes[e2];
      if (0 !== i2) return Math.sign(i2);
    }
    return 0;
  }
}
class lr {
  constructor() {
    this.S = 0, this.C = 0, this.I = new dr();
  }
  generate() {
    var t2 = this.generateOrAbort();
    if (N(t2)) {
      this.S = 0;
      var e2 = this.generateOrAbort();
      if (N(e2)) throw new Error("Could not generate UUID after timestamp reset");
      return e2;
    }
    return t2;
  }
  generateOrAbort() {
    var t2 = Date.now();
    if (t2 > this.S) this.S = t2, this.T();
    else {
      if (this.S >= t2 + 1e4) return;
      this.C++, this.C > 4398046511103 && (this.S++, this.T());
    }
    return ar.fromFieldsV7(this.S, Math.trunc(this.C / Math.pow(2, 30)), this.C & Math.pow(2, 30) - 1, this.I.nextUint32());
  }
  T() {
    this.C = 1024 * this.I.nextUint32() + (1023 & this.I.nextUint32());
  }
}
var ur, hr = (t2) => {
  if ("undefined" != typeof UUIDV7_DENY_WEAK_RNG && UUIDV7_DENY_WEAK_RNG) throw new Error("no cryptographically strong RNG available");
  for (var e2 = 0; t2.length > e2; e2++) t2[e2] = 65536 * Math.trunc(65536 * Math.random()) + Math.trunc(65536 * Math.random());
  return t2;
};
t && !N(t.crypto) && crypto.getRandomValues && (hr = (t2) => crypto.getRandomValues(t2));
class dr {
  constructor() {
    this.M = new Uint32Array(8), this.O = 1 / 0;
  }
  nextUint32() {
    return this.M.length > this.O || (hr(this.M), this.O = 0), this.M[this.O++];
  }
}
var vr = () => cr().toString(), cr = () => (ur || (ur = new lr())).generate(), pr = "", fr = /[a-z0-9][a-z0-9-]+\.[a-z]{2,}$/i;
var _r = { R: () => !!r, D(t2) {
  Ne.error("cookieStore error: " + t2);
}, A(t2) {
  if (r) {
    try {
      for (var e2 = t2 + "=", i2 = r.cookie.split(";").filter(((t3) => t3.length)), s2 = 0; i2.length > s2; s2++) {
        for (var n2 = i2[s2]; " " == n2.charAt(0); ) n2 = n2.substring(1, n2.length);
        if (0 === n2.indexOf(e2)) return decodeURIComponent(n2.substring(e2.length, n2.length));
      }
    } catch (t3) {
    }
    return null;
  }
}, F(t2) {
  var e2;
  try {
    e2 = JSON.parse(_r.A(t2)) || {};
  } catch (t3) {
  }
  return e2;
}, N(t2, e2, i2, s2, n2) {
  if (r) try {
    var o2 = "", a2 = "", l2 = (function(t3, e3) {
      if (e3) {
        var i3 = (function(t4, e4) {
          if (void 0 === e4 && (e4 = r), pr) return pr;
          if (!e4) return "";
          if (["localhost", "127.0.0.1"].includes(t4)) return "";
          for (var i4 = t4.split("."), s4 = Math.min(i4.length, 8), n3 = "dmn_chk_" + vr(); !pr && s4--; ) {
            var o3 = i4.slice(s4).join("."), a3 = n3 + "=1;domain=." + o3 + ";path=/";
            e4.cookie = a3 + ";max-age=3", e4.cookie.includes(n3) && (e4.cookie = a3 + ";max-age=0", pr = o3);
          }
          return pr;
        })(t3);
        if (!i3) {
          var s3 = ((t4) => {
            var e4 = t4.match(fr);
            return e4 ? e4[0] : "";
          })(t3);
          s3 !== i3 && Ne.info("Warning: cookie subdomain discovery mismatch", s3, i3), i3 = s3;
        }
        return i3 ? "; domain=." + i3 : "";
      }
      return "";
    })(r.location.hostname, s2);
    if (i2) {
      var u2 = /* @__PURE__ */ new Date();
      u2.setTime(u2.getTime() + 864e5 * i2), o2 = "; expires=" + u2.toUTCString();
    }
    n2 && (a2 = "; secure");
    var h2 = t2 + "=" + encodeURIComponent(JSON.stringify(e2)) + o2 + "; SameSite=Lax; path=/" + l2 + a2;
    return h2.length > 3686.4 && Ne.warn("cookieStore warning: large cookie, len=" + h2.length), r.cookie = h2, h2;
  } catch (t3) {
    return;
  }
}, q(t2, e2) {
  if (null != r && r.cookie) try {
    _r.N(t2, "", -1, e2);
  } catch (t3) {
    return;
  }
} }, gr = null, mr = { R() {
  if (!B(gr)) return gr;
  var e2 = true;
  if (N(t)) e2 = false;
  else try {
    var i2 = "__mplssupport__";
    mr.N(i2, "xyz"), '"xyz"' !== mr.A(i2) && (e2 = false), mr.q(i2);
  } catch (t2) {
    e2 = false;
  }
  return e2 || Ne.error("localStorage unsupported; falling back to cookie store"), gr = e2, e2;
}, D(t2) {
  Ne.error("localStorage error: " + t2);
}, A(e2) {
  try {
    return null == t ? void 0 : t.localStorage.getItem(e2);
  } catch (t2) {
    mr.D(t2);
  }
  return null;
}, F(t2) {
  try {
    return JSON.parse(mr.A(t2)) || {};
  } catch (t3) {
  }
  return null;
}, N(e2, i2) {
  try {
    null == t || t.localStorage.setItem(e2, JSON.stringify(i2));
  } catch (t2) {
    mr.D(t2);
  }
}, q(e2) {
  try {
    null == t || t.localStorage.removeItem(e2);
  } catch (t2) {
    mr.D(t2);
  }
} }, br = [qe, "distinct_id", ai, li, Ci, Ii, Ti], yr = {}, wr = { R: () => true, D(t2) {
  Ne.error("memoryStorage error: " + t2);
}, A: (t2) => yr[t2] || null, F: (t2) => yr[t2] || null, N(t2, e2) {
  yr[t2] = e2;
}, q(t2) {
  delete yr[t2];
} }, xr = null, Er = { R() {
  if (!B(xr)) return xr;
  if (xr = true, N(t)) xr = false;
  else try {
    var e2 = "__support__";
    Er.N(e2, "xyz"), '"xyz"' !== Er.A(e2) && (xr = false), Er.q(e2);
  } catch (t2) {
    xr = false;
  }
  return xr;
}, D(t2) {
  Ne.error("sessionStorage error: ", t2);
}, A(e2) {
  try {
    return null == t ? void 0 : t.sessionStorage.getItem(e2);
  } catch (t2) {
    Er.D(t2);
  }
  return null;
}, F(t2) {
  try {
    return JSON.parse(Er.A(t2)) || null;
  } catch (t3) {
  }
  return null;
}, N(e2, i2) {
  try {
    null == t || t.sessionStorage.setItem(e2, JSON.stringify(i2));
  } catch (t2) {
    Er.D(t2);
  }
}, q(e2) {
  try {
    null == t || t.sessionStorage.removeItem(e2);
  } catch (t2) {
    Er.D(t2);
  }
} };
class Sr {
  constructor(t2) {
    this._instance = t2;
  }
  get qt() {
    return this._instance.config;
  }
  get consent() {
    return this.rr() ? 0 : this.ir;
  }
  isOptedOut() {
    return this.qt.cookieless_mode === ji || this.isRejected() || -1 === this.consent && this.qt.cookieless_mode === Ni;
  }
  isOptedIn() {
    return !this.isOptedOut();
  }
  isExplicitlyOptedOut() {
    return 0 === this.consent;
  }
  isRejected() {
    return 0 === this.consent || -1 === this.consent && this.qt.opt_out_capturing_by_default;
  }
  optInOut(t2) {
    this.nr.N(this.sr, t2 ? 1 : 0, this.qt.cookie_expiration, this.qt.cross_subdomain_cookie, this.qt.secure_cookie);
  }
  reset() {
    this.nr.q(this.sr, this.qt.cross_subdomain_cookie);
  }
  get sr() {
    var { token: t2, opt_out_capturing_cookie_prefix: e2, consent_persistence_name: i2 } = this._instance.config;
    return i2 || (e2 ? e2 + t2 : "__ph_opt_in_out_" + t2);
  }
  get ir() {
    var t2 = this.nr.A(this.sr);
    return Z(t2) ? 1 : P(tt, t2) ? 0 : -1;
  }
  get nr() {
    var t2 = this.qt.opt_out_capturing_persistence_type, e2 = "localStorage" === t2 ? mr : _r;
    if (!this.ar || this.ar !== e2) {
      this.ar = e2;
      var i2 = "localStorage" === t2 ? _r : mr;
      i2.A(this.sr) && (this.ar.A(this.sr) || this.optInOut(Z(i2.A(this.sr))), i2.q(this.sr, this.qt.cross_subdomain_cookie));
    }
    return this.ar;
  }
  rr() {
    return !!this.qt.respect_dnt && [null == i ? void 0 : i.doNotTrack, null == i ? void 0 : i.msDoNotTrack, h.doNotTrack].some(((t2) => Z(t2)));
  }
}
var $r = je("[Dead Clicks]"), Tr = () => true, kr = (t2) => {
  var e2, i2 = !(null == (e2 = t2.instance.persistence) || !e2.get_property(Ze)), r2 = t2.instance.config.capture_dead_clicks;
  return W(r2) ? r2 : !!U(r2) || i2;
};
class Rr {
  get lazyLoadedDeadClicksAutocapture() {
    return this.ur;
  }
  constructor(t2, e2, i2) {
    this.instance = t2, this.isEnabled = e2, this.onCapture = i2, this.startIfEnabledOrStop();
  }
  onRemoteConfig(t2) {
    "captureDeadClicks" in t2 && (this.instance.persistence && this.instance.persistence.register({ [Ze]: t2.captureDeadClicks }), this.startIfEnabledOrStop());
  }
  startIfEnabledOrStop() {
    this.isEnabled(this) ? this.lr((() => {
      this.hr();
    })) : this.stop();
  }
  lr(t2) {
    var e2, i2;
    null != (e2 = h.__PosthogExtensions__) && e2.initDeadClicksAutocapture && t2(), null == (i2 = h.__PosthogExtensions__) || null == i2.loadExternalDependency || i2.loadExternalDependency(this.instance, "dead-clicks-autocapture", ((e3) => {
      e3 ? $r.error("failed to load script", e3) : t2();
    }));
  }
  hr() {
    var t2;
    if (r) {
      if (!this.ur && null != (t2 = h.__PosthogExtensions__) && t2.initDeadClicksAutocapture) {
        var e2 = U(this.instance.config.capture_dead_clicks) ? this.instance.config.capture_dead_clicks : {};
        e2.__onCapture = this.onCapture, this.ur = h.__PosthogExtensions__.initDeadClicksAutocapture(this.instance, e2), this.ur.start(r), $r.info("starting...");
      }
    } else $r.error("`document` not found. Cannot start.");
  }
  stop() {
    this.ur && (this.ur.stop(), this.ur = void 0, $r.info("stopping..."));
  }
}
var Pr = je("[SegmentIntegration]");
var Or = "posthog-js";
function Ir(t2, e2) {
  var { organization: i2, projectId: r2, prefix: s2, severityAllowList: n2 = ["error"], sendExceptionsToPostHog: o2 = true } = void 0 === e2 ? {} : e2;
  return (e3) => {
    var a2, l2, u2, h2, d2;
    if ("*" !== n2 && !n2.includes(e3.level) || !t2.__loaded) return e3;
    e3.tags || (e3.tags = {});
    var v2 = t2.requestRouter.endpointFor("ui", "/project/" + t2.config.token + "/person/" + t2.get_distinct_id());
    e3.tags["PostHog Person URL"] = v2, t2.sessionRecordingStarted() && (e3.tags["PostHog Recording URL"] = t2.get_session_replay_url({ withTimestamp: true }));
    var c2, p2 = (null == (a2 = e3.exception) ? void 0 : a2.values) || [], _2 = p2.map(((t3) => f({}, t3, { stacktrace: t3.stacktrace ? f({}, t3.stacktrace, { type: "raw", frames: (t3.stacktrace.frames || []).map(((t4) => f({}, t4, { platform: "web:javascript" }))) }) : void 0 }))), g2 = { $exception_message: (null == (l2 = p2[0]) ? void 0 : l2.value) || e3.message, $exception_type: null == (u2 = p2[0]) ? void 0 : u2.type, $exception_level: e3.level, $exception_list: _2, $sentry_event_id: e3.event_id, $sentry_exception: e3.exception, $sentry_exception_message: (null == (h2 = p2[0]) ? void 0 : h2.value) || e3.message, $sentry_exception_type: null == (d2 = p2[0]) ? void 0 : d2.type, $sentry_tags: e3.tags };
    return i2 && r2 && (g2.$sentry_url = (s2 || "https://sentry.io/organizations/") + i2 + "/issues/?project=" + r2 + "&query=" + e3.event_id), o2 && (null == (c2 = t2.exceptions) || c2.sendExceptionEvent(g2)), e3;
  };
}
class Cr {
  constructor(t2, e2, i2, r2, s2, n2) {
    this.name = Or, this.setupOnce = function(o2) {
      o2(Ir(t2, { organization: e2, projectId: i2, prefix: r2, severityAllowList: s2, sendExceptionsToPostHog: null == n2 || n2 }));
    };
  }
}
class Ar {
  constructor(t2) {
    this.cr = (t3, e2, i2) => {
      i2 && (i2.noSessionId || i2.activityTimeout || i2.sessionPastMaximumLength) && (Ne.info("[PageViewManager] Session rotated, clearing pageview state", { sessionId: t3, changeReason: i2 }), this.dr = void 0, this._instance.scrollManager.resetContext());
    }, this._instance = t2, this.vr();
  }
  vr() {
    var t2;
    this.pr = null == (t2 = this._instance.sessionManager) ? void 0 : t2.onSessionId(this.cr);
  }
  destroy() {
    var t2;
    null == (t2 = this.pr) || t2.call(this), this.pr = void 0;
  }
  doPageView(e2, i2) {
    var r2, s2 = this.gr(e2, i2);
    return this.dr = { pathname: null !== (r2 = null == t ? void 0 : t.location.pathname) && void 0 !== r2 ? r2 : "", pageViewId: i2, timestamp: e2 }, this._instance.scrollManager.resetContext(), s2;
  }
  doPageLeave(t2) {
    var e2;
    return this.gr(t2, null == (e2 = this.dr) ? void 0 : e2.pageViewId);
  }
  doEvent() {
    var t2;
    return { $pageview_id: null == (t2 = this.dr) ? void 0 : t2.pageViewId };
  }
  gr(t2, e2) {
    var i2 = this.dr;
    if (!i2) return { $pageview_id: e2 };
    var r2 = { $pageview_id: e2, $prev_pageview_id: i2.pageViewId }, s2 = this._instance.scrollManager.getContext();
    if (s2 && !this._instance.config.disable_scroll_properties) {
      var { maxScrollHeight: n2, lastScrollY: o2, maxScrollY: a2, maxContentHeight: l2, lastContentY: u2, maxContentY: h2 } = s2;
      if (!(N(n2) || N(o2) || N(a2) || N(l2) || N(u2) || N(h2))) {
        n2 = Math.ceil(n2), o2 = Math.ceil(o2), a2 = Math.ceil(a2), l2 = Math.ceil(l2), u2 = Math.ceil(u2), h2 = Math.ceil(h2);
        var d2 = n2 > 1 ? et(o2 / n2, 0, 1, Ne) : 1, v2 = n2 > 1 ? et(a2 / n2, 0, 1, Ne) : 1, c2 = l2 > 1 ? et(u2 / l2, 0, 1, Ne) : 1, p2 = l2 > 1 ? et(h2 / l2, 0, 1, Ne) : 1;
        r2 = Qi(r2, { $prev_pageview_last_scroll: o2, $prev_pageview_last_scroll_percentage: d2, $prev_pageview_max_scroll: a2, $prev_pageview_max_scroll_percentage: v2, $prev_pageview_last_content: u2, $prev_pageview_last_content_percentage: c2, $prev_pageview_max_content: h2, $prev_pageview_max_content_percentage: p2 });
      }
    }
    return i2.pathname && (r2.$prev_pageview_pathname = i2.pathname), i2.timestamp && (r2.$prev_pageview_duration = (t2.getTime() - i2.timestamp.getTime()) / 1e3), r2;
  }
}
var Fr = { [He]: { exposure: "hidden" }, [Ve]: { exposure: "hidden" }, __cmpns: { exposure: "hidden" }, [We]: { exposure: "hidden" }, [Ge]: { exposure: "event" }, [Ye]: { exposure: "hidden" }, [Je]: { exposure: "event" }, [Ke]: { exposure: "hidden" }, [Xe]: { exposure: "event" }, [Qe]: { exposure: "event" }, [Ze]: { exposure: "event" }, [ti]: { exposure: "hidden" }, [ei]: { exposure: "event" }, [ii]: { exposure: "hidden" }, $session_recording_enabled_server_side: { exposure: "hidden" }, [ai]: { exposure: "hidden" }, [li]: { exposure: "event" }, $session_past_minimum_duration: { exposure: "event" }, $session_recording_url_trigger_activated_session: { exposure: "event" }, $session_recording_event_trigger_activated_session: { exposure: "event" }, $debug_first_full_snapshot_timestamp: { exposure: "event" }, [ui]: { exposure: "derived", shouldSkipFromEventProperties: (t2, e2) => e2(), transformToEventProperties(t2) {
  if (!U(t2)) return {};
  for (var e2 = {}, i2 = Object.keys(t2), r2 = 0; i2.length > r2; r2++) e2["$feature/" + i2[r2]] = t2[i2[r2]];
  return e2;
} }, [hi]: { exposure: "event" }, [di]: { exposure: "hidden" }, [vi]: { exposure: "hidden" }, [ci]: { exposure: "event" }, [pi]: { exposure: "event" }, [fi]: { exposure: "event" }, [_i]: { exposure: "hidden" }, [gi]: { exposure: "hidden" }, [mi]: { exposure: "hidden" }, [bi]: { exposure: "hidden" }, [yi]: { exposure: "event" }, [wi]: { exposure: "hidden" }, $product_tours_activated: { exposure: "hidden" }, $conversations_widget_session_id: { exposure: "event" }, $conversations_ticket_id: { exposure: "event" }, $conversations_widget_state: { exposure: "event" }, $conversations_user_traits: { exposure: "event" }, [xi]: { exposure: "hidden" }, [Ei]: { exposure: "hidden" }, [Si]: { exposure: "hidden" }, [$i]: { exposure: "hidden" }, [Ti]: { exposure: "hidden" }, [ki]: { exposure: "hidden" }, [Ri]: { exposure: "hidden" }, [Pi]: { exposure: "hidden" }, [Oi]: { exposure: "hidden" }, [Ii]: { exposure: "hidden" }, [Ci]: { exposure: "hidden" }, [ri]: { exposure: "event" }, [si]: { exposure: "event" }, [ni]: { exposure: "event" }, [oi]: { exposure: "event" }, [Mi]: { exposure: "event" }, [Di]: { exposure: "event" }, [Ui]: { exposure: "event" }, $sdk_debug_replay_event_trigger_status: { exposure: "event" }, $sdk_debug_replay_linked_flag_trigger_status: { exposure: "event" }, $sdk_debug_replay_matched_recording_trigger_groups: { exposure: "event" }, $sdk_debug_replay_remote_trigger_matching_config: { exposure: "event" }, $sdk_debug_replay_trigger_groups_count: { exposure: "event" }, $sdk_debug_replay_url_trigger_status: { exposure: "event" }, $session_recording_start_reason: { exposure: "event" } }, Mr = [["$posthog_sr_group_event_trigger_", { exposure: "hidden" }], ["$posthog_sr_group_url_trigger_", { exposure: "hidden" }], ["$posthog_sr_group_sampling_", { exposure: "hidden" }]], Dr = (t2) => {
  var e2 = null == r ? void 0 : r.createElement("a");
  return N(e2) ? null : (e2.href = t2, e2);
}, Ur = function(t2, e2) {
  for (var i2, r2 = ((t2.split("#")[0] || "").split(/\?(.*)/)[1] || "").replace(/^\?+/g, "").split("&"), s2 = 0; r2.length > s2; s2++) {
    var n2 = r2[s2].split("=");
    if (n2[0] === e2) {
      i2 = n2;
      break;
    }
  }
  if (!M(i2) || 2 > i2.length) return "";
  var o2 = i2[1];
  try {
    o2 = decodeURIComponent(o2);
  } catch (t3) {
    Ne.error("Skipping decoding for malformed query param: " + o2);
  }
  return o2.replace(/\+/g, " ");
}, Lr = function(t2, e2, i2) {
  if (!t2 || !e2 || !e2.length) return t2;
  for (var r2 = t2.split("#"), s2 = r2[1], n2 = (r2[0] || "").split("?"), o2 = n2[1], a2 = n2[0], l2 = (o2 || "").split("&"), u2 = [], h2 = 0; l2.length > h2; h2++) {
    var d2 = l2[h2].split("=");
    M(d2) && (e2.includes(d2[0]) ? u2.push(d2[0] + "=" + i2) : u2.push(l2[h2]));
  }
  var v2 = a2;
  return null != o2 && (v2 += "?" + u2.join("&")), null != s2 && (v2 += "#" + s2), v2;
}, Nr = function(t2, e2) {
  var i2 = t2.match(new RegExp(e2 + "=([^&]*)"));
  return i2 ? i2[1] : null;
}, jr = "https?://(.*)", zr = ["gclid", "gclsrc", "dclid", "gbraid", "wbraid", "fbclid", "msclkid", "twclid", "li_fat_id", "igshid", "ttclid", "rdt_cid", "epik", "qclid", "sccid", "irclid", "_kx"], Br = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gad_source", "mc_cid", ...zr], Hr = "<masked>", qr = ["li_fat_id"];
function Vr(t2, e2, i2) {
  if (!r) return {};
  var s2, n2 = e2 ? [...zr, ...i2 || []] : [], o2 = Wr(Lr(r.URL, n2, Hr), t2), a2 = (s2 = {}, Xi(qr, (function(t3) {
    var e3 = _r.A(t3);
    s2[t3] = e3 || null;
  })), s2);
  return Qi(a2, o2);
}
function Wr(t2, e2) {
  var i2 = Br.concat(e2 || []), r2 = {};
  return Xi(i2, (function(e3) {
    var i3 = Ur(t2, e3);
    r2[e3] = i3 || null;
  })), r2;
}
function Gr(t2) {
  var e2 = (function(t3) {
    return t3 ? 0 === t3.search(jr + "google.([^/?]*)") ? "google" : 0 === t3.search(jr + "bing.com") ? "bing" : 0 === t3.search(jr + "yahoo.com") ? "yahoo" : 0 === t3.search(jr + "duckduckgo.com") ? "duckduckgo" : null : null;
  })(t2), i2 = "yahoo" != e2 ? "q" : "p", s2 = {};
  if (!B(e2)) {
    s2.$search_engine = e2;
    var n2 = r ? Ur(r.referrer, i2) : "";
    n2.length && (s2.ph_keyword = n2);
  }
  return s2;
}
function Yr() {
  return navigator.language || navigator.userLanguage;
}
var Jr = "$direct";
function Kr() {
  return (null == r ? void 0 : r.referrer) || Jr;
}
function Xr(t2, e2) {
  var i2 = t2 ? [...zr, ...e2 || []] : [], r2 = null == s ? void 0 : s.href.substring(0, 1e3);
  return { r: Kr().substring(0, 1e3), u: r2 ? Lr(r2, i2, Hr) : void 0 };
}
function Qr(t2) {
  var e2, { r: i2, u: r2 } = t2, s2 = { $referrer: i2, $referring_domain: null == i2 ? void 0 : i2 == Jr ? Jr : null == (e2 = Dr(i2)) ? void 0 : e2.host };
  if (r2) {
    s2.$current_url = r2;
    var n2 = Dr(r2);
    s2.$host = null == n2 ? void 0 : n2.host, s2.$pathname = null == n2 ? void 0 : n2.pathname;
    var o2 = Wr(r2);
    Qi(s2, o2);
  }
  if (i2) {
    var a2 = Gr(i2);
    Qi(s2, a2);
  }
  return s2;
}
function Zr() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (t2) {
    return;
  }
}
function ts() {
  try {
    return (/* @__PURE__ */ new Date()).getTimezoneOffset();
  } catch (t2) {
    return;
  }
}
var es = ["cookie", "localstorage", "localstorage+cookie", "sessionstorage", "memory"];
class is {
  constructor(t2, e2) {
    this.qt = t2, this.props = {}, this.mr = false, this.yr = ((t3) => {
      var e3 = "";
      return t3.token && (e3 = t3.token.replace(/\+/g, "PL").replace(/\//g, "SL").replace(/=/g, "EQ")), t3.persistence_name ? "ph_" + t3.persistence_name : "ph_" + e3 + "_posthog";
    })(t2), this.nr = this.br(t2), this.load(), t2.debug && Ne.info("Persistence loaded", t2.persistence, f({}, this.props)), this.update_config(t2, t2, e2), this.save();
  }
  isDisabled() {
    return !!this._r;
  }
  br(e2) {
    -1 === es.indexOf(e2.persistence.toLowerCase()) && (Ne.critical("Unknown persistence type " + e2.persistence + "; falling back to localStorage+cookie"), e2.persistence = "localStorage+cookie");
    var i2 = (function(e3) {
      void 0 === e3 && (e3 = []);
      var i3 = [...br, ...e3];
      return f({}, mr, { F(t2) {
        try {
          var e4 = {};
          try {
            e4 = _r.F(t2) || {};
          } catch (t3) {
          }
          var i4 = Qi(e4, JSON.parse(mr.A(t2) || "{}"));
          return mr.N(t2, i4), i4;
        } catch (t3) {
        }
        return null;
      }, N(t2, e4, r3, s2, n2, o2) {
        try {
          mr.N(t2, e4, void 0, void 0, o2);
          var a2 = {};
          i3.forEach(((t3) => {
            e4[t3] && (a2[t3] = e4[t3]);
          })), Object.keys(a2).length && _r.N(t2, a2, r3, s2, n2, o2);
        } catch (t3) {
          mr.D(t3);
        }
      }, q(e4, i4) {
        try {
          null == t || t.localStorage.removeItem(e4), _r.q(e4, i4);
        } catch (t2) {
          mr.D(t2);
        }
      } });
    })(e2.cookie_persisted_properties || []), r2 = e2.persistence.toLowerCase();
    return "localstorage" === r2 && mr.R() ? mr : "localstorage+cookie" === r2 && i2.R() ? i2 : "sessionstorage" === r2 && Er.R() ? Er : "memory" === r2 ? wr : "cookie" === r2 ? _r : i2.R() ? i2 : _r;
  }
  wr(t2) {
    var e2 = null != t2 ? t2 : this.qt.feature_flag_cache_ttl_ms;
    if (!e2 || 0 >= e2) return false;
    var i2 = this.props[$i];
    return !i2 || "number" != typeof i2 || Date.now() - i2 > e2;
  }
  properties() {
    var t2 = {};
    return Xi(this.props, ((e2, i2) => {
      var r2 = ((t3) => {
        var e3 = Fr[t3];
        if (e3) return e3;
        for (var [i3, r3] of Mr) if (0 === t3.indexOf(i3)) return r3;
      })(i2);
      if ("derived" === (null == r2 ? void 0 : r2.exposure)) {
        if (null != r2.shouldSkipFromEventProperties && r2.shouldSkipFromEventProperties(e2, i2 === ui ? () => this.wr() : () => false)) return;
        r2.transformToEventProperties && Qi(t2, r2.transformToEventProperties(e2));
      } else r2 && "event" !== r2.exposure || (t2[i2] = e2);
    })), t2;
  }
  load() {
    if (!this._r) {
      var t2 = this.nr.F(this.yr);
      t2 && (this.props = Qi({}, t2));
    }
  }
  save() {
    this._r || this.nr.N(this.yr, this.props, this.Sr, this.kr, this.Cr, this.qt.debug);
  }
  remove() {
    this.nr.q(this.yr, false), this.nr.q(this.yr, true);
  }
  clear() {
    this.remove(), this.props = {};
  }
  register_once(t2, e2, i2) {
    if (U(t2)) {
      N(e2) && (e2 = "None"), this.Sr = N(i2) ? this.Ir : i2;
      var r2 = false;
      if (Xi(t2, ((t3, i3) => {
        this.props.hasOwnProperty(i3) && this.props[i3] !== e2 || (this.Tr(i3, t3), r2 = true);
      })), r2) return this.save(), true;
    }
    return false;
  }
  register(t2, e2) {
    if (U(t2)) {
      this.Sr = N(e2) ? this.Ir : e2;
      var i2 = false;
      if (Xi(t2, ((e3, r2) => {
        t2.hasOwnProperty(r2) && this.props[r2] !== e3 && (this.Tr(r2, e3), i2 = true);
      })), i2) return this.save(), true;
    }
    return false;
  }
  unregister(t2) {
    t2 in this.props && (this.Er(t2), this.save());
  }
  update_campaign_params() {
    if (!this.mr) {
      var t2 = Vr(this.qt.custom_campaign_params, this.qt.mask_personal_data_properties, this.qt.custom_personal_data_properties);
      L(ir(t2)) || this.register(t2), this.mr = true;
    }
  }
  update_search_keyword() {
    var t2;
    this.register((t2 = null == r ? void 0 : r.referrer) ? Gr(t2) : {});
  }
  update_referrer_info() {
    var t2;
    this.register_once({ $referrer: Kr(), $referring_domain: null != r && r.referrer && (null == (t2 = Dr(r.referrer)) ? void 0 : t2.host) || Jr }, void 0);
  }
  set_initial_person_info() {
    this.props[Pi] || this.props[Oi] || this.register_once({ [Ii]: Xr(this.qt.mask_personal_data_properties, this.qt.custom_personal_data_properties) }, void 0);
  }
  get_initial_props() {
    var t2 = {};
    Xi([Oi, Pi], ((e3) => {
      var i3 = this.props[e3];
      i3 && Xi(i3, (function(e4, i4) {
        t2["$initial_" + I(i4)] = e4;
      }));
    }));
    var e2, i2, r2 = this.props[Ii];
    if (r2) {
      var s2 = (e2 = Qr(r2), i2 = {}, Xi(e2, (function(t3, e3) {
        i2["$initial_" + I(e3)] = t3;
      })), i2);
      Qi(t2, s2);
    }
    return t2;
  }
  safe_merge(t2) {
    return Xi(this.props, (function(e2, i2) {
      i2 in t2 || (t2[i2] = e2);
    })), t2;
  }
  update_config(t2, e2, i2) {
    if (this.Ir = this.Sr = t2.cookie_expiration, this.set_disabled(t2.disable_persistence || !!i2), this.set_cross_subdomain(t2.cross_subdomain_cookie), this.set_secure(t2.secure_cookie), t2.persistence !== e2.persistence || !((t3, e3) => {
      if (t3.length !== e3.length) return false;
      var i3 = [...t3].sort(), r3 = [...e3].sort();
      return i3.every(((t4, e4) => t4 === r3[e4]));
    })(t2.cookie_persisted_properties || [], e2.cookie_persisted_properties || [])) {
      var r2 = this.br(t2), s2 = this.props;
      this.clear(), this.nr = r2, this.props = s2, this.save();
    }
  }
  set_disabled(t2) {
    this._r = t2, this._r ? this.remove() : this.save();
  }
  set_cross_subdomain(t2) {
    t2 !== this.kr && (this.kr = t2, this.remove(), this.save());
  }
  set_secure(t2) {
    t2 !== this.Cr && (this.Cr = t2, this.remove(), this.save());
  }
  set_event_timer(t2, e2) {
    var i2 = this.props[We] || {};
    i2[t2] = e2, this.Tr(We, i2), this.save();
  }
  remove_event_timer(t2) {
    var e2 = this.props[We] || {}, i2 = e2[t2];
    return N(i2) || (delete e2[t2], this.Tr(We, e2), this.save()), i2;
  }
  get_property(t2) {
    return this.props[t2];
  }
  set_property(t2, e2) {
    this.Tr(t2, e2), this.save();
  }
  Tr(t2, e2) {
    this.props[t2] = e2;
  }
  Er(t2) {
    delete this.props[t2];
  }
}
var rs = { Activation: "events", Cancellation: "cancelEvents" }, as = { Popover: "popover", API: "api", Widget: "widget" }, ds = { SHOWN: "survey shown", DISMISSED: "survey dismissed", SENT: "survey sent" }, vs = { SURVEY_ID: "$survey_id", SURVEY_ITERATION: "$survey_iteration", SURVEY_LAST_SEEN_DATE: "$survey_last_seen_date" }, cs = { Popover: "popover", Inline: "inline" }, fs = { SHOWN: "product tour shown" }, _s = { TOUR_LAST_SEEN_DATE: "$product_tour_last_seen_date", TOUR_TYPE: "$product_tour_type" }, gs = je("[RateLimiter]");
class ms {
  constructor(t2) {
    this.serverLimits = {}, this.lastEventRateLimited = false, this.checkForLimiting = (t3) => {
      var e2 = t3.text;
      if (e2 && e2.length) try {
        (JSON.parse(e2).quota_limited || []).forEach(((t4) => {
          gs.info((t4 || "events") + " is quota limited."), this.serverLimits[t4] = (/* @__PURE__ */ new Date()).getTime() + 6e4;
        }));
      } catch (t4) {
        return void gs.warn('could not rate limit - continuing. Error: "' + (null == t4 ? void 0 : t4.message) + '"', { text: e2 });
      }
    }, this.instance = t2, this.lastEventRateLimited = this.clientRateLimitContext(true).isRateLimited;
  }
  get captureEventsPerSecond() {
    var t2;
    return (null == (t2 = this.instance.config.rate_limiting) ? void 0 : t2.events_per_second) || 10;
  }
  get captureEventsBurstLimit() {
    var t2;
    return Math.max((null == (t2 = this.instance.config.rate_limiting) ? void 0 : t2.events_burst_limit) || 10 * this.captureEventsPerSecond, this.captureEventsPerSecond);
  }
  clientRateLimitContext(t2) {
    var e2, i2, r2;
    void 0 === t2 && (t2 = false);
    var { captureEventsBurstLimit: s2, captureEventsPerSecond: n2 } = this, o2 = (/* @__PURE__ */ new Date()).getTime(), a2 = null !== (e2 = null == (i2 = this.instance.persistence) ? void 0 : i2.get_property(Ri)) && void 0 !== e2 ? e2 : { tokens: s2, last: o2 };
    a2.tokens += (o2 - a2.last) / 1e3 * n2, a2.last = o2, a2.tokens > s2 && (a2.tokens = s2);
    var l2 = 1 > a2.tokens;
    return l2 || t2 || (a2.tokens = Math.max(0, a2.tokens - 1)), !l2 || this.lastEventRateLimited || t2 || this.instance.capture("$$client_ingestion_warning", { $$client_ingestion_warning_message: "posthog-js client rate limited. Config is set to " + n2 + " events per second and " + s2 + " events burst limit." }, { skip_client_rate_limiting: true }), this.lastEventRateLimited = l2, null == (r2 = this.instance.persistence) || r2.set_property(Ri, a2), { isRateLimited: l2, remainingTokens: a2.tokens };
  }
  isServerRateLimited(t2) {
    var e2 = this.serverLimits[t2 || "events"] || false;
    return false !== e2 && (/* @__PURE__ */ new Date()).getTime() < e2;
  }
}
var bs = je("[RemoteConfig]");
class ys {
  constructor(t2) {
    this._instance = t2;
  }
  get remoteConfig() {
    var t2;
    return null == (t2 = h._POSTHOG_REMOTE_CONFIG) || null == (t2 = t2[this._instance.config.token]) ? void 0 : t2.config;
  }
  Mr(t2) {
    var e2, i2;
    null != (e2 = h.__PosthogExtensions__) && e2.loadExternalDependency ? null == (i2 = h.__PosthogExtensions__) || null == i2.loadExternalDependency || i2.loadExternalDependency(this._instance, "remote-config", (() => t2(this.remoteConfig))) : t2();
  }
  Pr(t2) {
    this._instance._send_request({ method: "GET", url: this._instance.requestRouter.endpointFor("assets", "/array/" + this._instance.config.token + "/config"), callback(e2) {
      t2(e2.json);
    } });
  }
  load() {
    try {
      if (this.remoteConfig) return bs.info("Using preloaded remote config", this.remoteConfig), this.Rr(this.remoteConfig), void this.Or();
      if (this._instance.Lr()) return void bs.warn("Remote config is disabled. Falling back to local config.");
      this.Mr(((t2) => {
        if (!t2) return bs.info("No config found after loading remote JS config. Falling back to JSON."), void this.Pr(((t3) => {
          this.Rr(t3), this.Or();
        }));
        this.Rr(t2), this.Or();
      }));
    } catch (t2) {
      bs.error("Error loading remote config", t2);
    }
  }
  stop() {
    this.Fr && (clearInterval(this.Fr), this.Fr = void 0);
  }
  refresh() {
    !this._instance.Lr() && r && "hidden" !== r.visibilityState && this._instance.reloadFeatureFlags();
  }
  Or() {
    var t2;
    if (!this.Fr) {
      var e2 = null !== (t2 = this._instance.config.remote_config_refresh_interval_ms) && void 0 !== t2 ? t2 : 3e5;
      0 !== e2 && (this.Fr = setInterval((() => {
        this.refresh();
      }), e2));
    }
  }
  Rr(t2) {
    var e2;
    t2 || bs.error("Failed to fetch remote config from PostHog."), this._instance.Rr(null != t2 ? t2 : {}), false !== (null == t2 ? void 0 : t2.hasFeatureFlags) && (this._instance.config.advanced_disable_feature_flags_on_first_load || null == (e2 = this._instance.featureFlags) || e2.ensureFlagsLoaded());
  }
}
var xs = { GZipJS: "gzip-js", Base64: "base64" }, Es = Uint8Array, Ss = Uint16Array, $s = Uint32Array, Ts = new Es([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]), ks = new Es([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]), Rs = new Es([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), Ps = function(t2, e2) {
  for (var i2 = new Ss(31), r2 = 0; 31 > r2; ++r2) i2[r2] = e2 += 1 << t2[r2 - 1];
  var s2 = new $s(i2[30]);
  for (r2 = 1; 30 > r2; ++r2) for (var n2 = i2[r2]; i2[r2 + 1] > n2; ++n2) s2[n2] = n2 - i2[r2] << 5 | r2;
  return [i2, s2];
}, Os = Ps(Ts, 2), Is = Os[1];
Os[0][28] = 258, Is[258] = 28;
for (var Cs = Ps(ks, 0)[1], As = new Ss(32768), Fs = 0; 32768 > Fs; ++Fs) {
  var Ms = (43690 & Fs) >>> 1 | (21845 & Fs) << 1;
  As[Fs] = ((65280 & (Ms = (61680 & (Ms = (52428 & Ms) >>> 2 | (13107 & Ms) << 2)) >>> 4 | (3855 & Ms) << 4)) >>> 8 | (255 & Ms) << 8) >>> 1;
}
var Ds = function(t2, e2, i2) {
  for (var r2 = t2.length, s2 = 0, n2 = new Ss(e2); r2 > s2; ++s2) ++n2[t2[s2] - 1];
  var o2, a2 = new Ss(e2);
  for (s2 = 0; e2 > s2; ++s2) a2[s2] = a2[s2 - 1] + n2[s2 - 1] << 1;
  for (o2 = new Ss(r2), s2 = 0; r2 > s2; ++s2) o2[s2] = As[a2[t2[s2] - 1]++] >>> 15 - t2[s2];
  return o2;
}, Us = new Es(288);
for (Fs = 0; 144 > Fs; ++Fs) Us[Fs] = 8;
for (Fs = 144; 256 > Fs; ++Fs) Us[Fs] = 9;
for (Fs = 256; 280 > Fs; ++Fs) Us[Fs] = 7;
for (Fs = 280; 288 > Fs; ++Fs) Us[Fs] = 8;
var Ls = new Es(32);
for (Fs = 0; 32 > Fs; ++Fs) Ls[Fs] = 5;
var Ns = Ds(Us, 9), js = Ds(Ls, 5), zs = function(t2) {
  return (t2 / 8 >> 0) + (7 & t2 && 1);
}, Bs = function(t2, e2, i2) {
  (null == i2 || i2 > t2.length) && (i2 = t2.length);
  var r2 = new (t2 instanceof Ss ? Ss : t2 instanceof $s ? $s : Es)(i2 - e2);
  return r2.set(t2.subarray(e2, i2)), r2;
}, Hs = function(t2, e2, i2) {
  var r2 = e2 / 8 >> 0;
  t2[r2] |= i2 <<= 7 & e2, t2[r2 + 1] |= i2 >>> 8;
}, qs = function(t2, e2, i2) {
  var r2 = e2 / 8 >> 0;
  t2[r2] |= i2 <<= 7 & e2, t2[r2 + 1] |= i2 >>> 8, t2[r2 + 2] |= i2 >>> 16;
}, Vs = function(t2, e2) {
  for (var i2 = [], r2 = 0; t2.length > r2; ++r2) t2[r2] && i2.push({ s: r2, f: t2[r2] });
  var s2 = i2.length, n2 = i2.slice();
  if (!s2) return [new Es(0), 0];
  if (1 == s2) {
    var o2 = new Es(i2[0].s + 1);
    return o2[i2[0].s] = 1, [o2, 1];
  }
  i2.sort((function(t3, e3) {
    return t3.f - e3.f;
  })), i2.push({ s: -1, f: 25001 });
  var a2 = i2[0], l2 = i2[1], u2 = 0, h2 = 1, d2 = 2;
  for (i2[0] = { s: -1, f: a2.f + l2.f, l: a2, r: l2 }; h2 != s2 - 1; ) a2 = i2[i2[d2].f > i2[u2].f ? u2++ : d2++], l2 = i2[u2 != h2 && i2[d2].f > i2[u2].f ? u2++ : d2++], i2[h2++] = { s: -1, f: a2.f + l2.f, l: a2, r: l2 };
  var v2 = n2[0].s;
  for (r2 = 1; s2 > r2; ++r2) n2[r2].s > v2 && (v2 = n2[r2].s);
  var c2 = new Ss(v2 + 1), p2 = Ws(i2[h2 - 1], c2, 0);
  if (p2 > e2) {
    r2 = 0;
    var f2 = 0, _2 = p2 - e2, g2 = 1 << _2;
    for (n2.sort((function(t3, e3) {
      return c2[e3.s] - c2[t3.s] || t3.f - e3.f;
    })); s2 > r2; ++r2) {
      var m2 = n2[r2].s;
      if (e2 >= c2[m2]) break;
      f2 += g2 - (1 << p2 - c2[m2]), c2[m2] = e2;
    }
    for (f2 >>>= _2; f2 > 0; ) {
      var b2 = n2[r2].s;
      e2 > c2[b2] ? f2 -= 1 << e2 - c2[b2]++ - 1 : ++r2;
    }
    for (; r2 >= 0 && f2; --r2) {
      var y2 = n2[r2].s;
      c2[y2] == e2 && (--c2[y2], ++f2);
    }
    p2 = e2;
  }
  return [new Es(c2), p2];
}, Ws = function(t2, e2, i2) {
  return -1 == t2.s ? Math.max(Ws(t2.l, e2, i2 + 1), Ws(t2.r, e2, i2 + 1)) : e2[t2.s] = i2;
}, Gs = function(t2) {
  for (var e2 = t2.length; e2 && !t2[--e2]; ) ;
  for (var i2 = new Ss(++e2), r2 = 0, s2 = t2[0], n2 = 1, o2 = function(t3) {
    i2[r2++] = t3;
  }, a2 = 1; e2 >= a2; ++a2) if (t2[a2] == s2 && a2 != e2) ++n2;
  else {
    if (!s2 && n2 > 2) {
      for (; n2 > 138; n2 -= 138) o2(32754);
      n2 > 2 && (o2(n2 > 10 ? n2 - 11 << 5 | 28690 : n2 - 3 << 5 | 12305), n2 = 0);
    } else if (n2 > 3) {
      for (o2(s2), --n2; n2 > 6; n2 -= 6) o2(8304);
      n2 > 2 && (o2(n2 - 3 << 5 | 8208), n2 = 0);
    }
    for (; n2--; ) o2(s2);
    n2 = 1, s2 = t2[a2];
  }
  return [i2.subarray(0, r2), e2];
}, Ys = function(t2, e2) {
  for (var i2 = 0, r2 = 0; e2.length > r2; ++r2) i2 += t2[r2] * e2[r2];
  return i2;
}, Js = function(t2, e2, i2) {
  var r2 = i2.length, s2 = zs(e2 + 2);
  t2[s2] = 255 & r2, t2[s2 + 1] = r2 >>> 8, t2[s2 + 2] = 255 ^ t2[s2], t2[s2 + 3] = 255 ^ t2[s2 + 1];
  for (var n2 = 0; r2 > n2; ++n2) t2[s2 + n2 + 4] = i2[n2];
  return 8 * (s2 + 4 + r2);
}, Ks = function(t2, e2, i2, r2, s2, n2, o2, a2, l2, u2, h2) {
  Hs(e2, h2++, i2), ++s2[256];
  for (var d2 = Vs(s2, 15), v2 = d2[0], c2 = d2[1], p2 = Vs(n2, 15), f2 = p2[0], _2 = p2[1], g2 = Gs(v2), m2 = g2[0], b2 = g2[1], y2 = Gs(f2), w2 = y2[0], x2 = y2[1], E2 = new Ss(19), S2 = 0; m2.length > S2; ++S2) E2[31 & m2[S2]]++;
  for (S2 = 0; w2.length > S2; ++S2) E2[31 & w2[S2]]++;
  for (var T2 = Vs(E2, 7), k2 = T2[0], R2 = T2[1], P2 = 19; P2 > 4 && !k2[Rs[P2 - 1]]; --P2) ;
  var O2, I2, C2, A2, F2 = u2 + 5 << 3, M2 = Ys(s2, Us) + Ys(n2, Ls) + o2, D2 = Ys(s2, v2) + Ys(n2, f2) + o2 + 14 + 3 * P2 + Ys(E2, k2) + (2 * E2[16] + 3 * E2[17] + 7 * E2[18]);
  if (M2 >= F2 && D2 >= F2) return Js(e2, h2, t2.subarray(l2, l2 + u2));
  if (Hs(e2, h2, 1 + (M2 > D2)), h2 += 2, M2 > D2) {
    O2 = Ds(v2, c2), I2 = v2, C2 = Ds(f2, _2), A2 = f2;
    var U2 = Ds(k2, R2);
    for (Hs(e2, h2, b2 - 257), Hs(e2, h2 + 5, x2 - 1), Hs(e2, h2 + 10, P2 - 4), h2 += 14, S2 = 0; P2 > S2; ++S2) Hs(e2, h2 + 3 * S2, k2[Rs[S2]]);
    h2 += 3 * P2;
    for (var L2 = [m2, w2], N2 = 0; 2 > N2; ++N2) {
      var j2 = L2[N2];
      for (S2 = 0; j2.length > S2; ++S2) Hs(e2, h2, U2[z2 = 31 & j2[S2]]), h2 += k2[z2], z2 > 15 && (Hs(e2, h2, j2[S2] >>> 5 & 127), h2 += j2[S2] >>> 12);
    }
  } else O2 = Ns, I2 = Us, C2 = js, A2 = Ls;
  for (S2 = 0; a2 > S2; ++S2) if (r2[S2] > 255) {
    var z2;
    qs(e2, h2, O2[257 + (z2 = r2[S2] >>> 18 & 31)]), h2 += I2[z2 + 257], z2 > 7 && (Hs(e2, h2, r2[S2] >>> 23 & 31), h2 += Ts[z2]);
    var B2 = 31 & r2[S2];
    qs(e2, h2, C2[B2]), h2 += A2[B2], B2 > 3 && (qs(e2, h2, r2[S2] >>> 5 & 8191), h2 += ks[B2]);
  } else qs(e2, h2, O2[r2[S2]]), h2 += I2[r2[S2]];
  return qs(e2, h2, O2[256]), h2 + I2[256];
}, Xs = new $s([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]), Qs = (function() {
  for (var t2 = new $s(256), e2 = 0; 256 > e2; ++e2) {
    for (var i2 = e2, r2 = 9; --r2; ) i2 = (1 & i2 && 3988292384) ^ i2 >>> 1;
    t2[e2] = i2;
  }
  return t2;
})(), Zs = function(t2, e2, i2) {
  for (; i2; ++e2) t2[e2] = i2, i2 >>>= 8;
};
function tn(t2, e2) {
  void 0 === e2 && (e2 = {});
  var i2 = /* @__PURE__ */ (function() {
    var t3 = 4294967295;
    return { p(e3) {
      for (var i3 = t3, r3 = 0; e3.length > r3; ++r3) i3 = Qs[255 & i3 ^ e3[r3]] ^ i3 >>> 8;
      t3 = i3;
    }, d() {
      return 4294967295 ^ t3;
    } };
  })(), r2 = t2.length;
  i2.p(t2);
  var s2, n2, o2, a2, l2, u2 = (a2 = 10 + ((s2 = e2).filename && s2.filename.length + 1 || 0), l2 = 8, (function(t3, e3, i3, r3, s3, n3) {
    var o3 = t3.length, a3 = new Es(r3 + o3 + 5 * (1 + Math.floor(o3 / 7e3)) + s3), l3 = a3.subarray(r3, a3.length - s3), u3 = 0;
    if (!e3 || 8 > o3) for (var h3 = 0; o3 >= h3; h3 += 65535) {
      var d2 = h3 + 65535;
      o3 > d2 ? u3 = Js(l3, u3, t3.subarray(h3, d2)) : (l3[h3] = true, u3 = Js(l3, u3, t3.subarray(h3, o3)));
    }
    else {
      for (var v2 = Xs[e3 - 1], c2 = v2 >>> 13, p2 = 8191 & v2, f2 = (1 << i3) - 1, _2 = new Ss(32768), g2 = new Ss(f2 + 1), m2 = Math.ceil(i3 / 3), b2 = 2 * m2, y2 = function(e4) {
        return (t3[e4] ^ t3[e4 + 1] << m2 ^ t3[e4 + 2] << b2) & f2;
      }, w2 = new $s(25e3), x2 = new Ss(288), E2 = new Ss(32), S2 = 0, T2 = 0, k2 = (h3 = 0, 0), R2 = 0, P2 = 0; o3 > h3; ++h3) {
        var O2 = y2(h3), I2 = 32767 & h3, C2 = g2[O2];
        if (_2[I2] = C2, g2[O2] = I2, h3 >= R2) {
          var A2 = o3 - h3;
          if ((S2 > 7e3 || k2 > 24576) && A2 > 423) {
            u3 = Ks(t3, l3, 0, w2, x2, E2, T2, k2, P2, h3 - P2, u3), k2 = S2 = T2 = 0, P2 = h3;
            for (var F2 = 0; 286 > F2; ++F2) x2[F2] = 0;
            for (F2 = 0; 30 > F2; ++F2) E2[F2] = 0;
          }
          var M2 = 2, D2 = 0, U2 = p2, L2 = I2 - C2 & 32767;
          if (A2 > 2 && O2 == y2(h3 - L2)) for (var N2 = Math.min(c2, A2) - 1, j2 = Math.min(32767, h3), z2 = Math.min(258, A2); j2 >= L2 && --U2 && I2 != C2; ) {
            if (t3[h3 + M2] == t3[h3 + M2 - L2]) {
              for (var B2 = 0; z2 > B2 && t3[h3 + B2] == t3[h3 + B2 - L2]; ++B2) ;
              if (B2 > M2) {
                if (M2 = B2, D2 = L2, B2 > N2) break;
                var H2 = Math.min(L2, B2 - 2), q2 = 0;
                for (F2 = 0; H2 > F2; ++F2) {
                  var V2 = h3 - L2 + F2 + 32768 & 32767, W2 = V2 - _2[V2] + 32768 & 32767;
                  W2 > q2 && (q2 = W2, C2 = V2);
                }
              }
            }
            L2 += (I2 = C2) - (C2 = _2[I2]) + 32768 & 32767;
          }
          if (D2) {
            w2[k2++] = 268435456 | Is[M2] << 18 | Cs[D2];
            var G2 = 31 & Is[M2], Y2 = 31 & Cs[D2];
            T2 += Ts[G2] + ks[Y2], ++x2[257 + G2], ++E2[Y2], R2 = h3 + M2, ++S2;
          } else w2[k2++] = t3[h3], ++x2[t3[h3]];
        }
      }
      u3 = Ks(t3, l3, true, w2, x2, E2, T2, k2, P2, h3 - P2, u3);
    }
    return Bs(a3, 0, r3 + zs(u3) + s3);
  })(n2 = t2, null == (o2 = e2).level ? 6 : o2.level, null == o2.mem ? Math.ceil(1.5 * Math.max(8, Math.min(13, Math.log(n2.length)))) : 12 + o2.mem, a2, l2)), h2 = u2.length;
  return (function(t3, e3) {
    var i3 = e3.filename;
    if (t3[0] = 31, t3[1] = 139, t3[2] = 8, t3[8] = 2 > e3.level ? 4 : 9 == e3.level ? 2 : 0, t3[9] = 3, 0 != e3.mtime && Zs(t3, 4, Math.floor(new Date(e3.mtime || Date.now()) / 1e3)), i3) {
      t3[3] = 8;
      for (var r3 = 0; i3.length >= r3; ++r3) t3[r3 + 10] = i3.charCodeAt(r3);
    }
  })(u2, e2), Zs(u2, h2 - 8, i2.d()), Zs(u2, h2 - 4, r2), u2;
}
var en = !!o || !!n, rn = "text/plain", sn = false, nn = (t2, e2) => {
  var [i2, r2] = t2.split("#"), [s2, n2] = i2.split("?");
  if (!n2) return t2;
  var o2 = n2.split("&").filter(((t3) => t3.split("=")[0] !== e2)).join("&");
  return s2 + (o2 ? "?" + o2 : "") + (r2 ? "#" + r2 : "");
}, on = function(t2, e2, i2) {
  var r2;
  void 0 === i2 && (i2 = true);
  var [s2, n2] = t2.split("?"), o2 = f({}, e2), a2 = null !== (r2 = null == n2 ? void 0 : n2.split("&").map(((t3) => {
    var e3, [r3, s3] = t3.split("="), n3 = i2 && null !== (e3 = o2[r3]) && void 0 !== e3 ? e3 : s3;
    return delete o2[r3], r3 + "=" + n3;
  }))) && void 0 !== r2 ? r2 : [], l2 = (function(t3, e3) {
    var i3, r3;
    void 0 === e3 && (e3 = "&");
    var s3 = [];
    return Xi(t3, (function(t4, e4) {
      N(t4) || N(e4) || "undefined" === e4 || (i3 = encodeURIComponent(((t5) => t5 instanceof File)(t4) ? t4.name : t4.toString()), r3 = encodeURIComponent(e4), s3[s3.length] = r3 + "=" + i3);
    })), s3.join(e3);
  })(o2);
  return l2 && a2.push(l2), s2 + "?" + a2.join("&");
}, an = (t2, e2) => JSON.stringify(t2, ((t3, e3) => "bigint" == typeof e3 ? e3.toString() : e3), e2), ln = (t2) => {
  if (t2.er) return t2.er;
  var { data: e2, compression: i2 } = t2;
  if (e2) {
    if (i2 === xs.GZipJS) {
      var r2 = tn((function(t3, e3) {
        var i3 = t3.length;
        if ("undefined" != typeof TextEncoder) return new TextEncoder().encode(t3);
        for (var r3 = new Es(t3.length + (t3.length >>> 1)), s3 = 0, n3 = function(t4) {
          r3[s3++] = t4;
        }, o3 = 0; i3 > o3; ++o3) {
          if (s3 + 5 > r3.length) {
            var a2 = new Es(s3 + 8 + (i3 - o3 << 1));
            a2.set(r3), r3 = a2;
          }
          var l2 = t3.charCodeAt(o3);
          128 > l2 ? n3(l2) : 2048 > l2 ? (n3(192 | l2 >>> 6), n3(128 | 63 & l2)) : l2 > 55295 && 57344 > l2 ? (n3(240 | (l2 = 65536 + (1047552 & l2) | 1023 & t3.charCodeAt(++o3)) >>> 18), n3(128 | l2 >>> 12 & 63), n3(128 | l2 >>> 6 & 63), n3(128 | 63 & l2)) : (n3(224 | l2 >>> 12), n3(128 | l2 >>> 6 & 63), n3(128 | 63 & l2));
        }
        return Bs(r3, 0, s3);
      })(an(e2)), { mtime: 0 });
      return { contentType: rn, body: r2.buffer.slice(r2.byteOffset, r2.byteOffset + r2.byteLength), estimatedSize: r2.byteLength };
    }
    if (i2 === xs.Base64) {
      var s2 = (function(t3) {
        return t3 ? btoa(encodeURIComponent(t3).replace(/%([0-9A-F]{2})/g, ((t4, e3) => String.fromCharCode(parseInt(e3, 16))))) : t3;
      })(an(e2)), n2 = ((t3) => "data=" + encodeURIComponent("string" == typeof t3 ? t3 : an(t3)))(s2);
      return { contentType: "application/x-www-form-urlencoded", body: n2, estimatedSize: new Blob([n2]).size };
    }
    var o2 = an(e2);
    return { contentType: "application/json", body: o2, estimatedSize: new Blob([o2]).size };
  }
}, un = (t2) => {
  var e2, i2, r2, s2 = ln(t2);
  return !s2 || (i2 = t2.compression, r2 = Ur(t2.url, "compression"), i2 !== m.GZipJS && r2 !== m.GZipJS && "gzip" !== r2) || ((e2 = s2.body) instanceof ArrayBuffer ? w(new Uint8Array(e2)) : ArrayBuffer.isView(e2) && w(new Uint8Array(e2.buffer, e2.byteOffset, e2.byteLength))) ? { url: t2.url, encodedBody: s2 } : (sn = true, { url: nn(t2.url, "compression"), encodedBody: ln(f({}, t2, { compression: void 0, er: void 0 })) });
}, hn = (function() {
  var t2 = p((function* (t3) {
    var e2 = an(t3.data), i2 = yield (function(t4, e3, i3) {
      return T.apply(this, arguments);
    })(e2, v.DEBUG, { rethrow: true });
    if (!i2) return t3;
    var r2 = yield i2.arrayBuffer();
    return f({}, t3, { er: { contentType: rn, body: r2, estimatedSize: r2.byteLength } });
  }));
  return function(e2) {
    return t2.apply(this, arguments);
  };
})(), dn = (t2, e2) => on(t2, { _: (/* @__PURE__ */ new Date()).getTime().toString(), ver: v.JS_SDK_VERSION, compression: e2 }), vn = [];
n && vn.push({ transport: "fetch", method(t2) {
  var e2, { url: i2, encodedBody: r2 } = un(t2), { contentType: s2, body: o2, estimatedSize: l2 } = null != r2 ? r2 : {}, u2 = new Headers();
  Xi(t2.headers, (function(t3, e3) {
    u2.append(e3, t3);
  })), s2 && u2.append("Content-Type", s2);
  var h2 = null;
  if (a) {
    var d2 = new a();
    h2 = { signal: d2.signal, timeout: setTimeout((() => d2.abort()), t2.timeout) };
  }
  n(i2, f({ method: (null == t2 ? void 0 : t2.method) || "GET", headers: u2, keepalive: "POST" === t2.method && 52428.8 > (l2 || 0), body: o2, signal: null == (e2 = h2) ? void 0 : e2.signal }, t2.fetchOptions)).then(((e3) => e3.text().then(((i3) => {
    var r3 = { statusCode: e3.status, text: i3 };
    if (200 === e3.status) try {
      r3.json = JSON.parse(i3);
    } catch (t3) {
      Ne.error(t3);
    }
    null == t2.callback || t2.callback(r3);
  })))).catch(((e3) => {
    Ne.error(e3), null == t2.callback || t2.callback({ statusCode: 0, error: e3 });
  })).finally((() => h2 ? clearTimeout(h2.timeout) : null));
} }), o && vn.push({ transport: "XHR", method(t2) {
  var e2 = new o(), { url: i2, encodedBody: r2 } = un(t2);
  e2.open(t2.method || "GET", i2, true);
  var { contentType: s2, body: n2 } = null != r2 ? r2 : {};
  Xi(t2.headers, (function(t3, i3) {
    e2.setRequestHeader(i3, t3);
  })), s2 && e2.setRequestHeader("Content-Type", s2), t2.timeout && (e2.timeout = t2.timeout), t2.disableXHRCredentials || (e2.withCredentials = true), e2.onreadystatechange = () => {
    if (4 === e2.readyState) {
      var i3 = { statusCode: e2.status, text: e2.responseText };
      if (200 === e2.status) try {
        i3.json = JSON.parse(e2.responseText);
      } catch (t3) {
      }
      null == t2.callback || t2.callback(i3);
    }
  }, e2.send(n2);
} }), null != i && i.sendBeacon && vn.push({ transport: "sendBeacon", method(t2) {
  try {
    var { url: e2, encodedBody: r2 } = un(t2), s2 = on(e2, { beacon: "1" }), { contentType: n2, body: o2 } = null != r2 ? r2 : {};
    if (!o2) return;
    var a2 = o2 instanceof Blob ? o2 : new Blob([o2], { type: n2 });
    i.sendBeacon(s2, a2);
  } catch (t3) {
  }
} });
var cn = 3e3;
class pn {
  constructor(t2, e2) {
    this.Ar = true, this.Nr = [], this.$r = et((null == e2 ? void 0 : e2.flush_interval_ms) || cn, 250, 5e3, Ne.createLogger("flush interval"), cn), this.Dr = t2;
  }
  enqueue(t2) {
    this.Nr.push(t2), this.qr || this.jr();
  }
  unload() {
    this.Hr();
    var t2 = this.Nr.length > 0 ? this.Ur() : {}, e2 = Object.values(t2);
    [...e2.filter(((t3) => 0 === t3.url.indexOf("/e"))), ...e2.filter(((t3) => 0 !== t3.url.indexOf("/e")))].map(((t3) => {
      this.Dr(f({}, t3, { transport: "sendBeacon" }));
    }));
  }
  enable() {
    this.Ar = false, this.jr();
  }
  jr() {
    var t2 = this;
    this.Ar || (this.qr = setTimeout((() => {
      if (this.Hr(), this.Nr.length > 0) {
        var e2 = this.Ur(), i2 = function() {
          var i3 = e2[r2], s2 = (/* @__PURE__ */ new Date()).getTime();
          i3.data && M(i3.data) && Xi(i3.data, ((t3) => {
            t3.offset = Math.abs(t3.timestamp - s2), delete t3.timestamp;
          })), t2.Dr(i3);
        };
        for (var r2 in e2) i2();
      }
    }), this.$r));
  }
  Hr() {
    clearTimeout(this.qr), this.qr = void 0;
  }
  Ur() {
    var t2 = {};
    return Xi(this.Nr, ((e2) => {
      var i2, r2 = e2, s2 = (r2 ? r2.batchKey : null) || r2.url;
      N(t2[s2]) && (t2[s2] = f({}, r2, { data: [] })), null == (i2 = t2[s2].data) || i2.push(r2.data);
    })), this.Nr = [], t2;
  }
}
var fn = ["retriesPerformedSoFar"];
class _n {
  constructor(e2) {
    this.Br = false, this.zr = 3e3, this.Nr = [], this._instance = e2, this.Nr = [], this.Vr = true, !N(t) && "onLine" in t.navigator && (this.Vr = t.navigator.onLine, this.Wr = () => {
      this.Vr = true, this.Zr();
    }, this.Gr = () => {
      this.Vr = false;
    }, nr(t, "online", this.Wr), nr(t, "offline", this.Gr));
  }
  get length() {
    return this.Nr.length;
  }
  retriableRequest(t2) {
    var { retriesPerformedSoFar: e2 } = t2, i2 = _(t2, fn);
    V(e2) && (i2.url = on(i2.url, { retry_count: e2 })), this._instance._send_request(f({}, i2, { callback: (t3) => {
      200 === t3.statusCode || t3.statusCode >= 400 && 500 > t3.statusCode || (null != e2 ? e2 : 0) >= 10 ? null == i2.callback || i2.callback(t3) : this.Qr(f({ retriesPerformedSoFar: e2 }, i2));
    } }));
  }
  Qr(t2) {
    var e2 = t2.retriesPerformedSoFar || 0;
    t2.retriesPerformedSoFar = e2 + 1;
    var i2 = (function(t3) {
      var e3 = 3e3 * Math.pow(2, t3), i3 = e3 / 2, r3 = Math.min(18e5, e3), s3 = Math.random() - 0.5;
      return Math.ceil(r3 + s3 * (r3 - i3));
    })(e2), r2 = Date.now() + i2;
    this.Nr.push({ retryAt: r2, requestOptions: t2 });
    var s2 = "Enqueued failed request for retry in " + i2;
    navigator.onLine || (s2 += " (Browser is offline)"), Ne.warn(s2), this.Br || (this.Br = true, this.Jr());
  }
  Jr() {
    if (this.Kr && clearTimeout(this.Kr), 0 === this.Nr.length) return this.Br = false, void (this.Kr = void 0);
    this.Kr = setTimeout((() => {
      this.Vr && this.Nr.length > 0 && this.Zr(), this.Jr();
    }), this.zr);
  }
  Zr() {
    var t2 = Date.now(), e2 = [], i2 = this.Nr.filter(((i3) => t2 > i3.retryAt || (e2.push(i3), false)));
    if (this.Nr = e2, i2.length > 0) for (var { requestOptions: r2 } of i2) this.retriableRequest(r2);
  }
  unload() {
    for (var { requestOptions: e2 } of (this.Kr && (clearTimeout(this.Kr), this.Kr = void 0), this.Br = false, N(t) || (this.Wr && (t.removeEventListener("online", this.Wr), this.Wr = void 0), this.Gr && (t.removeEventListener("offline", this.Gr), this.Gr = void 0)), this.Nr)) try {
      this._instance._send_request(f({}, e2, { transport: "sendBeacon" }));
    } catch (t2) {
      Ne.error(t2);
    }
    this.Nr = [];
  }
}
class gn {
  constructor(t2) {
    this.Yr = () => {
      var t3, e2, i2, r2;
      this.Xr || (this.Xr = {});
      var s2 = this.scrollElement(), n2 = this.scrollY(), o2 = s2 ? Math.max(0, s2.scrollHeight - s2.clientHeight) : 0, a2 = n2 + ((null == s2 ? void 0 : s2.clientHeight) || 0), l2 = (null == s2 ? void 0 : s2.scrollHeight) || 0;
      this.Xr.lastScrollY = Math.ceil(n2), this.Xr.maxScrollY = Math.max(n2, null !== (t3 = this.Xr.maxScrollY) && void 0 !== t3 ? t3 : 0), this.Xr.maxScrollHeight = Math.max(o2, null !== (e2 = this.Xr.maxScrollHeight) && void 0 !== e2 ? e2 : 0), this.Xr.lastContentY = a2, this.Xr.maxContentY = Math.max(a2, null !== (i2 = this.Xr.maxContentY) && void 0 !== i2 ? i2 : 0), this.Xr.maxContentHeight = Math.max(l2, null !== (r2 = this.Xr.maxContentHeight) && void 0 !== r2 ? r2 : 0);
    }, this._instance = t2;
  }
  get ti() {
    return this._instance.config.scroll_root_selector;
  }
  getContext() {
    return this.Xr;
  }
  resetContext() {
    var t2 = this.Xr;
    return setTimeout(this.Yr, 0), t2;
  }
  startMeasuringScrollPosition() {
    nr(t, "scroll", this.Yr, { capture: true }), nr(t, "scrollend", this.Yr, { capture: true }), nr(t, "resize", this.Yr);
  }
  scrollElement() {
    if (!this.ti) return null == t ? void 0 : t.document.documentElement;
    var e2 = M(this.ti) ? this.ti : [this.ti];
    for (var i2 of e2) {
      var r2 = null == t ? void 0 : t.document.querySelector(i2);
      if (r2) return r2;
    }
  }
  scrollY() {
    if (this.ti) {
      var e2 = this.scrollElement();
      return e2 && e2.scrollTop || 0;
    }
    return t && (t.scrollY || t.pageYOffset || t.document.documentElement.scrollTop) || 0;
  }
  scrollX() {
    if (this.ti) {
      var e2 = this.scrollElement();
      return e2 && e2.scrollLeft || 0;
    }
    return t && (t.scrollX || t.pageXOffset || t.document.documentElement.scrollLeft) || 0;
  }
}
var mn = (t2) => Xr(null == t2 ? void 0 : t2.config.mask_personal_data_properties, null == t2 ? void 0 : t2.config.custom_personal_data_properties);
class bn {
  constructor(t2, e2, i2, r2) {
    this.ei = (t3) => {
      var e3 = this.ri();
      if (!e3 || e3.sessionId !== t3) {
        var i3 = { sessionId: t3, props: this.ii(this._instance) };
        this.ni.register({ [ki]: i3 });
      }
    }, this._instance = t2, this.si = e2, this.ni = i2, this.ii = r2 || mn, this.si.onSessionId(this.ei);
  }
  ri() {
    return this.ni.props[ki];
  }
  getSetOnceProps() {
    var t2, e2 = null == (t2 = this.ri()) ? void 0 : t2.props;
    return e2 ? "r" in e2 ? Qr(e2) : { $referring_domain: e2.referringDomain, $pathname: e2.initialPathName, utm_source: e2.utm_source, utm_campaign: e2.utm_campaign, utm_medium: e2.utm_medium, utm_content: e2.utm_content, utm_term: e2.utm_term } : {};
  }
  getSessionProps() {
    var t2 = {};
    return Xi(ir(this.getSetOnceProps()), ((e2, i2) => {
      "$current_url" === i2 && (i2 = "url"), t2["$session_entry_" + I(i2)] = e2;
    })), t2;
  }
}
class yn {
  constructor() {
    this.oi = {};
  }
  on(t2, e2) {
    return this.oi[t2] || (this.oi[t2] = []), this.oi[t2].push(e2), () => {
      this.oi[t2] = this.oi[t2].filter(((t3) => t3 !== e2));
    };
  }
  emit(t2, e2) {
    for (var i2 of this.oi[t2] || []) i2(e2);
    for (var r2 of this.oi["*"] || []) r2(t2, e2);
  }
}
var wn = je("[SessionId]");
class xn {
  on(t2, e2) {
    return this.ai.on(t2, e2);
  }
  constructor(t2, e2, i2) {
    var r2;
    if (this.ui = null, this.li = [], this.hi = void 0, this.ai = new yn(), this.ci = (t3, e3) => !(!V(t3) || !V(e3)) && Math.abs(t3 - e3) > this.sessionTimeoutMs, !t2.persistence) throw new Error("SessionIdManager requires a PostHogPersistence instance");
    if (t2.config.cookieless_mode === ji) throw new Error('SessionIdManager cannot be used with cookieless_mode="always"');
    this.qt = t2.config, this.ni = t2.persistence, this.di = void 0, this.vi = void 0, this._sessionStartTimestamp = null, this._sessionActivityTimestamp = null, this.fi = e2 || vr, this.pi = i2 || vr;
    var s2 = this.qt.persistence_name || this.qt.token;
    if (this._sessionTimeoutMs = 1e3 * et(this.qt.session_idle_timeout_seconds || 1800, 60, 36e3, wn.createLogger("session_idle_timeout_seconds"), 1800), t2.register({ $configured_session_timeout_ms: this._sessionTimeoutMs }), this.gi(), this.mi = "ph_" + s2 + "_window_id", this.yi = "ph_" + s2 + "_primary_window_exists", this.bi()) {
      var n2 = Er.F(this.mi), o2 = Er.F(this.yi);
      n2 && !o2 ? this.di = n2 : Er.q(this.mi), Er.N(this.yi, true);
    }
    if (null != (r2 = this.qt.bootstrap) && r2.sessionID) try {
      var a2 = ((t3) => {
        var e3 = this.qt.bootstrap.sessionID.replace(/-/g, "");
        if (32 !== e3.length) throw new Error("Not a valid UUID");
        if ("7" !== e3[12]) throw new Error("Not a UUIDv7");
        return parseInt(e3.substring(0, 12), 16);
      })();
      this.wi(this.qt.bootstrap.sessionID, (/* @__PURE__ */ new Date()).getTime(), a2);
    } catch (t3) {
      wn.error("Invalid sessionID in bootstrap", t3);
    }
    this.xi();
  }
  get sessionTimeoutMs() {
    return this._sessionTimeoutMs;
  }
  onSessionId(t2) {
    return N(this.li) && (this.li = []), this.li.push(t2), this.vi && t2(this.vi, this.di), () => {
      this.li = this.li.filter(((e2) => e2 !== t2));
    };
  }
  bi() {
    return "memory" !== this.qt.persistence && !this.ni._r && Er.R();
  }
  Si(t2) {
    t2 !== this.di && (this.di = t2, this.bi() && Er.N(this.mi, t2));
  }
  ki() {
    return this.di ? this.di : this.bi() ? Er.F(this.mi) : null;
  }
  Ci(t2) {
    var e2 = this.ui;
    return !B(e2) && !B(t2) && 5e3 > Math.abs(t2 - e2);
  }
  wi(t2, e2, i2) {
    var r2 = e2 !== this._sessionActivityTimestamp, s2 = !(t2 !== this.vi || i2 !== this._sessionStartTimestamp);
    this._sessionStartTimestamp = i2, this._sessionActivityTimestamp = e2, this.vi = t2, s2 && !r2 || s2 && this.Ci(e2) || (this.ui = e2, this.ni.register({ [ai]: [e2, t2, i2] }));
  }
  Ii() {
    var t2;
    if (!B(this._sessionActivityTimestamp) && this._sessionActivityTimestamp !== this.ui) {
      this.ni.load();
      var [, e2, i2] = this.Ti();
      e2 === this.vi && i2 === this._sessionStartTimestamp && (this.ui = this._sessionActivityTimestamp, this.ni.register({ [ai]: [this._sessionActivityTimestamp, null !== (t2 = this.vi) && void 0 !== t2 ? t2 : null, this._sessionStartTimestamp] }));
    }
  }
  Ei() {
    var [t2] = this.Ti(), e2 = V(t2) ? t2 : 0, i2 = V(this._sessionActivityTimestamp) ? this._sessionActivityTimestamp : 0;
    return Math.max(e2, i2);
  }
  Ti() {
    var t2 = this.ni.props[ai];
    return M(t2) && 2 === t2.length && t2.push(t2[0]), t2 || [0, null, 0];
  }
  resetSessionId() {
    this.ui = null, clearTimeout(this.Mi), this.Mi = void 0, this.wi(null, null, null);
  }
  destroy() {
    this.Ii(), clearTimeout(this.Mi), this.Mi = void 0, this.hi && t && (t.removeEventListener(Vi, this.hi, { capture: false }), this.hi = void 0), this.li = [];
  }
  xi() {
    this.hi = () => {
      this.Ii(), this.bi() && Er.q(this.yi);
    }, nr(t, Vi, this.hi, { capture: false });
  }
  checkAndGetSessionAndWindowId(t2, e2) {
    if (void 0 === t2 && (t2 = false), void 0 === e2 && (e2 = null), this.qt.cookieless_mode === ji) throw new Error('checkAndGetSessionAndWindowId should not be called with cookieless_mode="always"');
    var i2 = e2 || (/* @__PURE__ */ new Date()).getTime(), [, r2, s2] = this.Ti(), n2 = this.Ei(), o2 = this.ki(), a2 = V(s2) && Math.abs(i2 - s2) > 864e5, l2 = false, u2 = !r2, h2 = !u2 && !t2 && this.ci(i2, n2);
    u2 || h2 || a2 ? (r2 = this.fi(), o2 = this.pi(), wn.info("new session ID generated", { sessionId: r2, windowId: o2, changeReason: { noSessionId: u2, activityTimeout: h2, sessionPastMaximumLength: a2 } }), s2 = i2, l2 = true) : o2 || (o2 = this.pi(), l2 = true);
    var d2 = V(n2) && t2 && !a2 ? n2 : i2, v2 = V(s2) ? s2 : (/* @__PURE__ */ new Date()).getTime();
    return this.Si(o2), this.wi(r2, d2, v2), t2 || this.gi(), l2 && this.li.forEach(((t3) => t3(r2, o2, l2 ? { noSessionId: u2, activityTimeout: h2, sessionPastMaximumLength: a2 } : void 0))), { sessionId: r2, windowId: o2, sessionStartTimestamp: v2, changeReason: l2 ? { noSessionId: u2, activityTimeout: h2, sessionPastMaximumLength: a2 } : void 0, lastActivityTimestamp: n2 };
  }
  gi() {
    clearTimeout(this.Mi), this.Mi = setTimeout((() => {
      var t2 = this.Ei();
      if (this.ci((/* @__PURE__ */ new Date()).getTime(), t2)) {
        var e2 = this.vi;
        this.resetSessionId(), this.ai.emit("forcedIdleReset", { idleSessionId: e2 });
      }
    }), 1.1 * this.sessionTimeoutMs);
  }
}
var En = function(t2, e2) {
  if (!t2) return false;
  var i2 = t2.userAgent;
  if (i2 && R(i2, e2)) return true;
  try {
    var r2 = null == t2 ? void 0 : t2.userAgentData;
    if (null != r2 && r2.brands && r2.brands.some(((t3) => R(null == t3 ? void 0 : t3.brand, e2)))) return true;
  } catch (t3) {
  }
  return !!t2.webdriver;
}, Sn = function(t2, e2) {
  if (!(function(t3) {
    try {
      new RegExp(t3);
    } catch (t4) {
      return false;
    }
    return true;
  })(e2)) return false;
  try {
    return new RegExp(e2).test(t2);
  } catch (t3) {
    return false;
  }
};
function $n(t2, e2, i2) {
  return an({ distinct_id: t2, userPropertiesToSet: e2, userPropertiesToSetOnce: i2 });
}
var Tn = { exact: (t2, e2) => e2.some(((e3) => t2.some(((t3) => e3 === t3)))), is_not: (t2, e2) => e2.every(((e3) => t2.every(((t3) => e3 !== t3)))), regex: (t2, e2) => e2.some(((e3) => t2.some(((t3) => Sn(e3, t3))))), not_regex: (t2, e2) => e2.every(((e3) => t2.every(((t3) => !Sn(e3, t3))))), icontains: (t2, e2) => e2.map(kn).some(((e3) => t2.map(kn).some(((t3) => e3.includes(t3))))), not_icontains: (t2, e2) => e2.map(kn).every(((e3) => t2.map(kn).every(((t3) => !e3.includes(t3))))), gt: (t2, e2) => e2.some(((e3) => {
  var i2 = parseFloat(e3);
  return !isNaN(i2) && t2.some(((t3) => i2 > parseFloat(t3)));
})), lt: (t2, e2) => e2.some(((e3) => {
  var i2 = parseFloat(e3);
  return !isNaN(i2) && t2.some(((t3) => i2 < parseFloat(t3)));
})) }, kn = (t2) => t2.toLowerCase();
function Rn(t2, e2) {
  return !t2 || Object.entries(t2).every(((t3) => {
    var [i2, r2] = t3, s2 = null == e2 ? void 0 : e2[i2];
    if (N(s2) || B(s2)) return false;
    var n2 = [String(s2)], o2 = Tn[r2.operator];
    return !!o2 && o2(r2.values, n2);
  }));
}
var Pn = "custom", On = "i.posthog.com", In = /^\/static\//;
class Cn {
  constructor(t2) {
    this.Pi = {}, this.instance = t2;
  }
  get apiHost() {
    var t2 = this.instance.config.api_host.trim().replace(/\/$/, "");
    return "https://app.posthog.com" === t2 ? "https://us.i.posthog.com" : t2;
  }
  get flagsApiHost() {
    var t2 = this.instance.config.flags_api_host;
    return t2 ? t2.trim().replace(/\/$/, "") : this.apiHost;
  }
  get uiHost() {
    var t2, e2 = null == (t2 = this.instance.config.ui_host) ? void 0 : t2.replace(/\/$/, "");
    return e2 || (e2 = this.apiHost.replace("." + On, ".posthog.com")), "https://app.posthog.com" === e2 ? "https://us.posthog.com" : e2;
  }
  get region() {
    return this.Pi[this.apiHost] || (this.Pi[this.apiHost] = /https:\/\/(app|us|us-assets)(\.i)?\.posthog\.com/i.test(this.apiHost) ? "us" : /https:\/\/(eu|eu-assets)(\.i)?\.posthog\.com/i.test(this.apiHost) ? "eu" : Pn), this.Pi[this.apiHost];
  }
  Ri(t2) {
    var e2 = this.instance.config.__preview_external_dependency_versioned_paths;
    if ("string" == typeof e2 && In.test(t2)) return e2.trim().replace(/\/$/, "") || void 0;
  }
  endpointFor(t2, e2) {
    if (void 0 === e2 && (e2 = ""), e2 && (e2 = "/" === e2[0] ? e2 : "/" + e2), "ui" === t2) return this.uiHost + e2;
    if ("flags" === t2) return this.flagsApiHost + e2;
    if ("assets" === t2) {
      var i2 = this.Ri(e2);
      if (i2) return "" + i2 + e2;
    }
    if (this.region === Pn) return this.apiHost + e2;
    var r2 = On + e2;
    switch (t2) {
      case "assets":
        return "https://" + this.region + "-assets." + r2;
      case "api":
        return "https://" + this.region + "." + r2;
    }
  }
}
var An = je("[Surveys]"), Fn = "seenSurvey_", Mn = [as.Popover, as.Widget, as.API], Dn = { ignoreConditions: false, ignoreDelay: false, displayType: cs.Popover }, Un = je("[PostHog ExternalIntegrations]"), Ln = { intercom: "intercom-integration", crispChat: "crisp-chat-integration" };
class Nn {
  constructor(t2) {
    this._instance = t2;
  }
  lr(t2, e2) {
    var i2;
    null == (i2 = h.__PosthogExtensions__) || null == i2.loadExternalDependency || i2.loadExternalDependency(this._instance, t2, ((t3) => {
      if (t3) return Un.error("failed to load script", t3);
      e2();
    }));
  }
  startIfEnabledOrStop() {
    var t2 = this, e2 = function(e3) {
      var i3, s3, n2;
      !r2 || null != (i3 = h.__PosthogExtensions__) && null != (i3 = i3.integrations) && i3[e3] || t2.lr(Ln[e3], (() => {
        var i4;
        null == (i4 = h.__PosthogExtensions__) || null == (i4 = i4.integrations) || null == (i4 = i4[e3]) || i4.start(t2._instance);
      })), !r2 && null != (s3 = h.__PosthogExtensions__) && null != (s3 = s3.integrations) && s3[e3] && (null == (n2 = h.__PosthogExtensions__) || null == (n2 = n2.integrations) || null == (n2 = n2[e3]) || n2.stop());
    };
    for (var [i2, r2] of Object.entries(null !== (s2 = this._instance.config.integrations) && void 0 !== s2 ? s2 : {})) {
      var s2;
      e2(i2);
    }
  }
}
var jn, zn = {}, Bn = 0, Hn = () => {
}, qn = 'Consent opt in/out is not valid with cookieless_mode="always" and will be ignored', Vn = "Surveys module not available", Wn = "sanitize_properties is deprecated. Use before_send instead", Gn = "Invalid value for property_denylist config: ", Yn = "posthog", Jn = !en && -1 === (null == u ? void 0 : u.indexOf("MSIE")) && -1 === (null == u ? void 0 : u.indexOf("Mozilla")), Kn = (e2) => {
  var i2;
  return f({ api_host: "https://us.i.posthog.com", flags_api_host: null, ui_host: null, token: "", autocapture: true, cross_subdomain_cookie: sr(null == r ? void 0 : r.location), persistence: "localStorage+cookie", persistence_name: "", cookie_persisted_properties: [], loaded: Hn, save_campaign_params: true, custom_campaign_params: [], custom_blocked_useragents: [], save_referrer: true, capture_pageleave: "if_capture_pageview", defaults: null != e2 ? e2 : "unset", __preview_deferred_init_extensions: false, __preview_external_dependency_versioned_paths: false, debug: s && j(null == s ? void 0 : s.search) && -1 !== s.search.indexOf("__posthog_debug=true") || false, cookie_expiration: 365, upgrade: false, disable_session_recording: false, disable_persistence: false, disable_web_experiments: true, disable_surveys: false, disable_surveys_automatic_display: false, disable_conversations: false, disable_product_tours: false, disable_external_dependency_loading: false, enable_recording_console_log: void 0, secure_cookie: "https:" === (null == t || null == (i2 = t.location) ? void 0 : i2.protocol), ip: false, opt_out_capturing_by_default: false, opt_out_persistence_by_default: false, opt_out_useragent_filter: false, opt_out_capturing_persistence_type: "localStorage", consent_persistence_name: null, opt_out_capturing_cookie_prefix: null, opt_in_site_apps: false, property_denylist: [], respect_dnt: false, sanitize_properties: null, request_headers: {}, request_batching: true, properties_string_max_length: 65535, mask_all_element_attributes: false, mask_all_text: false, mask_personal_data_properties: false, custom_personal_data_properties: [], advanced_disable_flags: false, advanced_disable_decide: false, advanced_disable_feature_flags: false, advanced_disable_feature_flags_on_first_load: false, advanced_only_evaluate_survey_feature_flags: false, advanced_feature_flags_dedup_per_session: false, advanced_enable_surveys: false, advanced_disable_toolbar_metrics: false, feature_flag_request_timeout_ms: 3e3, surveys_request_timeout_ms: 1e4, on_request_error(t2) {
    Ne.error("Bad HTTP status: " + t2.statusCode + " " + t2.text);
  }, get_device_id: (t2) => t2, capture_performance: void 0, name: "posthog", bootstrap: {}, disable_compression: false, session_idle_timeout_seconds: 1800, person_profiles: Hi, before_send: void 0, request_queue_config: { flush_interval_ms: cn }, error_tracking: {}, _onCapture: Hn, __preview_eager_load_replay: false }, ((t2) => ({ rageclick: !t2 || "2025-11-30" > t2 || { content_ignorelist: true }, capture_pageview: !t2 || "2025-05-24" > t2 || "history_change", session_recording: t2 && t2 >= "2025-11-30" ? { strictMinimumDuration: true } : {}, external_scripts_inject_target: t2 && t2 >= "2026-01-30" ? "head" : "body", internal_or_test_user_hostname: t2 && t2 >= "2026-01-30" ? /^(localhost|127\.0\.0\.1)$/ : void 0 }))(e2));
}, Xn = [["process_person", "person_profiles"], ["xhr_headers", "request_headers"], ["cookie_name", "persistence_name"], ["disable_cookie", "disable_persistence"], ["store_google", "save_campaign_params"], ["verbose", "debug"]], Qn = (t2) => {
  var e2 = {};
  for (var [i2, r2] of Xn) N(t2[i2]) || (e2[r2] = t2[i2]);
  var s2 = Qi({}, e2, t2);
  return M(t2.property_blacklist) && (N(t2.property_denylist) ? s2.property_denylist = t2.property_blacklist : M(t2.property_denylist) ? s2.property_denylist = [...t2.property_blacklist, ...t2.property_denylist] : Ne.error(Gn + t2.property_denylist)), s2;
};
class Zn {
  constructor() {
    this.__forceAllowLocalhost = false;
  }
  get Oi() {
    return this.__forceAllowLocalhost;
  }
  set Oi(t2) {
    Ne.error("WebPerformanceObserver is deprecated and has no impact on network capture. Use `_forceAllowLocalhostNetworkCapture` on `posthog.sessionRecording`"), this.__forceAllowLocalhost = t2;
  }
}
class to {
  Li(t2, e2) {
    if (t2) {
      var i2 = this.Fi.indexOf(t2);
      -1 !== i2 && this.Fi.splice(i2, 1);
    }
    return this.Fi.push(e2), null == e2.initialize || e2.initialize(), e2;
  }
  Ai() {
    return this.config.cookieless_mode === ji || this.config.cookieless_mode === Ni && this.consent.isRejected();
  }
  get decideEndpointWasHit() {
    var t2, e2;
    return null !== (t2 = null == (e2 = this.featureFlags) ? void 0 : e2.hasLoadedFlags) && void 0 !== t2 && t2;
  }
  get flagsEndpointWasHit() {
    var t2, e2;
    return null !== (t2 = null == (e2 = this.featureFlags) ? void 0 : e2.hasLoadedFlags) && void 0 !== t2 && t2;
  }
  constructor() {
    var t2;
    this.webPerformance = new Zn(), this.Ni = false, this.version = v.LIB_VERSION, this.$i = new yn(), this.Fi = [], this._calculate_event_properties = this.calculateEventProperties.bind(this), this.config = Kn(), this.SentryIntegration = Cr, this.sentryIntegration = (t3) => (function(t4, e3) {
      var i2 = Ir(t4, e3);
      return { name: Or, processEvent: (t5) => i2(t5) };
    })(this, t3), this.__request_queue = [], this.__loaded = false, this.analyticsDefaultEndpoint = "/e/", this.Di = false, this.qi = null, this.ji = null, this.Hi = null, this.scrollManager = new gn(this), this.pageViewManager = new Ar(this), this.rateLimiter = new ms(this), this.requestRouter = new Cn(this), this.consent = new Sr(this), this.externalIntegrations = new Nn(this);
    var e2 = null !== (t2 = to.__defaultExtensionClasses) && void 0 !== t2 ? t2 : {};
    this.featureFlags = e2.featureFlags && new e2.featureFlags(this), this.toolbar = e2.toolbar && new e2.toolbar(this), this.surveys = e2.surveys && new e2.surveys(this), this.conversations = e2.conversations && new e2.conversations(this), this.logs = e2.logs && new e2.logs(this), this.experiments = e2.experiments && new e2.experiments(this), this.exceptions = e2.exceptions && new e2.exceptions(this), this.people = { set: (t3, e3, i2) => {
      var r2 = j(t3) ? { [t3]: e3 } : t3;
      this.setPersonProperties(r2), null == i2 || i2({});
    }, set_once: (t3, e3, i2) => {
      var r2 = j(t3) ? { [t3]: e3 } : t3;
      this.setPersonProperties(void 0, r2), null == i2 || i2({});
    } }, this.on("eventCaptured", ((t3) => Ne.info('send "' + (null == t3 ? void 0 : t3.event) + '"', t3)));
  }
  init(t2, e2, i2) {
    if (i2 && i2 !== Yn) {
      var r2, s2 = null !== (r2 = zn[i2]) && void 0 !== r2 ? r2 : new to();
      return s2._init(t2, e2, i2), zn[i2] = s2, zn[Yn][i2] = s2, s2;
    }
    return this._init(t2, e2, i2);
  }
  _init(e2, i2, r2) {
    var s2, n2;
    if (void 0 === i2 && (i2 = {}), N(e2) || z(e2)) return Ne.critical("PostHog was initialized without a token. This likely indicates a misconfiguration. Please check the first argument passed to posthog.init()"), this;
    if (this.__loaded) return console.warn("[PostHog.js]", "You have already initialized PostHog! Re-initializing is a no-op"), this;
    this.__loaded = true, this.config = {}, i2.debug = this.Ui(i2.debug), this.Bi = i2, this.zi = [], i2.person_profiles ? this.ji = i2.person_profiles : i2.process_person && (this.ji = i2.process_person), this.set_config(Qi({}, Kn(i2.defaults), Qn(i2), { name: r2, token: e2 })), this.config.on_xhr_error && Ne.error("on_xhr_error is deprecated. Use on_request_error instead"), this.compression = i2.disable_compression ? void 0 : xs.GZipJS;
    var o2 = this.Vi();
    this.persistence = new is(this.config, o2), this.sessionPersistence = "sessionStorage" === this.config.persistence || "memory" === this.config.persistence ? this.persistence : new is(f({}, this.config, { persistence: "sessionStorage" }), o2);
    var a2 = f({}, this.persistence.props), l2 = f({}, this.sessionPersistence.props);
    this.register({ $initialization_time: (/* @__PURE__ */ new Date()).toISOString() }), this.Wi = new pn(((t2) => this.Zi(t2)), this.config.request_queue_config), this.Gi = new _n(this), this.__request_queue = [];
    var u2 = this.Ai();
    if (u2 || (this.sessionManager = new xn(this), this.sessionPropsManager = new bn(this, this.sessionManager, this.persistence)), this.config.__preview_deferred_init_extensions ? (Ne.info("Deferring extension initialization to improve startup performance"), setTimeout((() => {
      this.Qi(u2);
    }), 0)) : (Ne.info("Initializing extensions synchronously"), this.Qi(u2)), v.DEBUG = v.DEBUG || this.config.debug, v.DEBUG && Ne.info("Starting in debug mode", { this: this, config: i2, thisC: f({}, this.config), p: a2, s: l2 }), !this.config.identity_distinct_id || null != (s2 = i2.bootstrap) && s2.distinctID || (i2.bootstrap = f({}, i2.bootstrap, { distinctID: this.config.identity_distinct_id, isIdentifiedID: true })), void 0 !== (null == (n2 = i2.bootstrap) ? void 0 : n2.distinctID)) {
      var h2 = i2.bootstrap.distinctID, d2 = this.get_distinct_id(), c2 = this.persistence.get_property(Ti);
      if (i2.bootstrap.isIdentifiedID && null != d2 && d2 !== h2 && c2 === zi) this.identify(h2);
      else if (i2.bootstrap.isIdentifiedID && null != d2 && d2 !== h2 && c2 === Bi) Ne.warn("Bootstrap distinctID differs from an already-identified user. The existing identity is preserved. Call reset() before reinitializing if you intend to switch users.");
      else {
        var p2 = this.config.get_device_id(vr()), _2 = i2.bootstrap.isIdentifiedID ? p2 : h2;
        this.persistence.set_property(Ti, i2.bootstrap.isIdentifiedID ? Bi : zi), this.register({ distinct_id: h2, $device_id: _2 });
      }
    }
    if (u2) this.register_once({ distinct_id: Fi, $device_id: null }, "");
    else if (!this.get_distinct_id()) {
      var g2 = this.config.get_device_id(vr());
      this.register_once({ distinct_id: g2, $device_id: g2 }, ""), this.persistence.set_property(Ti, zi);
    }
    return nr(t, "onpagehide" in self ? "pagehide" : "unload", this._handle_unload.bind(this), { passive: false }), i2.segment ? (function(t2, e3) {
      var i3 = t2.config.segment;
      if (!i3) return e3();
      !(function(t3, e4) {
        var i4 = t3.config.segment;
        if (!i4) return e4();
        var r3 = (i5) => {
          var r4 = () => i5.anonymousId() || vr();
          t3.config.get_device_id = r4, i5.id() && (t3.register({ distinct_id: i5.id(), $device_id: r4() }), t3.persistence.set_property(Ti, Bi)), e4();
        }, s3 = i4.user();
        "then" in s3 && D(s3.then) ? s3.then(r3) : r3(s3);
      })(t2, (() => {
        i3.register(((t3) => {
          Promise && Promise.resolve || Pr.warn("This browser does not have Promise support, and can not use the segment integration");
          var e4 = (e5, i4) => {
            if (!i4) return e5;
            e5.event.userId || e5.event.anonymousId === t3.get_distinct_id() || (Pr.info("No userId set, resetting PostHog"), t3.reset()), e5.event.userId && e5.event.userId !== t3.get_distinct_id() && (Pr.info("UserId set, identifying with PostHog"), t3.identify(e5.event.userId));
            var r3 = t3.calculateEventProperties(i4, e5.event.properties);
            return e5.event.properties = Object.assign({}, r3, e5.event.properties), e5;
          };
          return { name: "PostHog JS", type: "enrichment", version: "1.0.0", isLoaded: () => true, load: () => Promise.resolve(), track: (t4) => e4(t4, t4.event.event), page: (t4) => e4(t4, Wi), identify: (t4) => e4(t4, Yi), screen: (t4) => e4(t4, "$screen") };
        })(t2)).then((() => {
          e3();
        }));
      }));
    })(this, (() => this.Ji())) : this.Ji(), D(this.config._onCapture) && this.config._onCapture !== Hn && (Ne.warn("onCapture is deprecated. Please use `before_send` instead"), this.on("eventCaptured", ((t2) => this.config._onCapture(t2.event, t2)))), this.config.ip && Ne.warn('The `ip` config option has NO EFFECT AT ALL and has been deprecated. Use a custom transformation or "Discard IP data" project setting instead. See https://posthog.com/tutorials/web-redact-properties#hiding-customer-ip-address for more information.'), this;
  }
  Qi(t2) {
    var e2, i2, r2, s2, n2, o2, a2, l2 = performance.now(), u2 = f({}, to.__defaultExtensionClasses, this.config.__extensionClasses), h2 = [];
    u2.featureFlags && this.Fi.push(this.featureFlags = null !== (e2 = this.featureFlags) && void 0 !== e2 ? e2 : new u2.featureFlags(this)), u2.exceptions && this.Fi.push(this.exceptions = null !== (i2 = this.exceptions) && void 0 !== i2 ? i2 : new u2.exceptions(this)), u2.historyAutocapture && this.Fi.push(this.historyAutocapture = new u2.historyAutocapture(this)), u2.tracingHeaders && this.Fi.push(new u2.tracingHeaders(this)), u2.siteApps && this.Fi.push(this.siteApps = new u2.siteApps(this)), u2.sessionRecording && !t2 && this.Fi.push(this.sessionRecording = new u2.sessionRecording(this)), this.config.disable_scroll_properties || h2.push((() => {
      this.scrollManager.startMeasuringScrollPosition();
    })), u2.autocapture && this.Fi.push(this.autocapture = new u2.autocapture(this)), u2.surveys && this.Fi.push(this.surveys = null !== (r2 = this.surveys) && void 0 !== r2 ? r2 : new u2.surveys(this)), u2.logs && this.Fi.push(this.logs = null !== (s2 = this.logs) && void 0 !== s2 ? s2 : new u2.logs(this)), u2.conversations && this.Fi.push(this.conversations = null !== (n2 = this.conversations) && void 0 !== n2 ? n2 : new u2.conversations(this)), u2.productTours && this.Fi.push(this.productTours = new u2.productTours(this)), u2.heatmaps && this.Fi.push(this.heatmaps = new u2.heatmaps(this)), u2.webVitalsAutocapture && this.Fi.push(this.webVitalsAutocapture = new u2.webVitalsAutocapture(this)), u2.exceptionObserver && this.Fi.push(this.exceptionObserver = new u2.exceptionObserver(this)), u2.deadClicksAutocapture && this.Fi.push(this.deadClicksAutocapture = new u2.deadClicksAutocapture(this, kr)), u2.toolbar && this.Fi.push(this.toolbar = null !== (o2 = this.toolbar) && void 0 !== o2 ? o2 : new u2.toolbar(this)), u2.experiments && this.Fi.push(this.experiments = null !== (a2 = this.experiments) && void 0 !== a2 ? a2 : new u2.experiments(this)), this.Fi.forEach(((t3) => {
      t3.initialize && h2.push((() => {
        null == t3.initialize || t3.initialize();
      }));
    })), h2.push((() => {
      if (this.Ki) {
        var t3 = this.Ki;
        this.Ki = void 0, this.Rr(t3);
      }
    })), this.Yi(h2, l2);
  }
  Yi(t2, e2) {
    for (; t2.length > 0; ) {
      if (this.config.__preview_deferred_init_extensions && performance.now() - e2 >= 30 && t2.length > 0) return void setTimeout((() => {
        this.Yi(t2, e2);
      }), 0);
      var i2 = t2.shift();
      if (i2) try {
        i2();
      } catch (t3) {
        Ne.error("Error initializing extension:", t3);
      }
    }
    var r2 = Math.round(performance.now() - e2);
    this.register_for_session({ [Mi]: this.config.__preview_deferred_init_extensions ? "deferred" : "synchronous", [Di]: r2 }), this.config.__preview_deferred_init_extensions && Ne.info("PostHog extensions initialized (" + r2 + "ms)");
  }
  Rr(t2) {
    var e2;
    if (!r || !r.body) return Ne.info("document not ready yet, trying again in 500 milliseconds..."), void setTimeout((() => {
      this.Rr(t2);
    }), 500);
    this.config.__preview_deferred_init_extensions && (this.Ki = t2), this.Xi = t2, this.compression = void 0, t2.supportedCompression && !this.config.disable_compression && (this.compression = P(t2.supportedCompression, xs.GZipJS) ? xs.GZipJS : P(t2.supportedCompression, xs.Base64) ? xs.Base64 : void 0), null != (e2 = t2.analytics) && e2.endpoint && (this.analyticsDefaultEndpoint = t2.analytics.endpoint), this.set_config({ person_profiles: this.ji ? this.ji : Hi }), this.Fi.forEach(((e3) => null == e3.onRemoteConfig ? void 0 : e3.onRemoteConfig(t2)));
  }
  Ji() {
    try {
      this.config.loaded(this);
    } catch (t3) {
      Ne.critical("`loaded` function failed", t3);
    }
    if (this.tn(), this.config.internal_or_test_user_hostname && null != s && s.hostname) {
      var t2 = s.hostname, e2 = this.config.internal_or_test_user_hostname;
      ("string" == typeof e2 ? t2 === e2 : e2.test(t2)) && this.setInternalOrTestUser();
    }
    this.config.capture_pageview && setTimeout((() => {
      (this.consent.isOptedIn() || this.Ai()) && this.en();
    }), 1), this.rn = new ys(this), this.rn.load();
  }
  tn() {
    var t2;
    this.is_capturing() && this.config.request_batching && (null == (t2 = this.Wi) || t2.enable());
  }
  _dom_loaded() {
    this.is_capturing() && Ki(this.__request_queue, ((t2) => this.Zi(t2))), this.__request_queue = [], this.tn();
  }
  _handle_unload() {
    var t2, e2, i2, r2;
    null == (t2 = this.surveys) || t2.handlePageUnload(), this.config.request_batching ? (this.nn() && this.capture(Gi), null == (e2 = this.logs) || e2.flushLogs("sendBeacon"), null == (i2 = this.Wi) || i2.unload(), null == (r2 = this.Gi) || r2.unload()) : this.nn() && this.capture(Gi, null, { transport: "sendBeacon" });
  }
  _send_request(t2) {
    this.__loaded && (Jn ? this.__request_queue.push(t2) : this.rateLimiter.isServerRateLimited(t2.batchKey) || (t2.transport = t2.transport || this.config.api_transport, t2.url = on(t2.url, { ip: this.config.ip ? 1 : 0 }), t2.headers = f({}, this.config.request_headers, t2.headers), t2.compression = "best-available" === t2.compression ? this.compression : t2.compression, t2.disableXHRCredentials = this.config.__preview_disable_xhr_credentials, this.config.__preview_disable_beacon && (t2.disableTransport = ["sendBeacon"]), t2.fetchOptions = t2.fetchOptions || this.config.fetch_options, ((t3) => {
      var e2, i2, r2, s2 = f({}, t3);
      s2.timeout = s2.timeout || 6e4, s2.url = dn(s2.url, s2.compression);
      var n2 = null !== (e2 = s2.transport) && void 0 !== e2 ? e2 : "fetch", o2 = vn.filter(((t4) => !s2.disableTransport || !t4.transport || !s2.disableTransport.includes(t4.transport))), a2 = null !== (i2 = null == (r2 = (function(t4, e3) {
        for (var i3 = 0; t4.length > i3; i3++) if (t4[i3].transport === n2) return t4[i3];
      })(o2)) ? void 0 : r2.method) && void 0 !== i2 ? i2 : o2[0].method;
      if (!a2) throw new Error("No available transport method");
      "sendBeacon" !== n2 && s2.data && s2.compression === xs.GZipJS && l && !sn ? hn(s2).then(((t4) => {
        a2(t4);
      })).catch(((e3) => {
        if (x(e3)) return sn = true, void a2(f({}, s2, { compression: void 0, url: dn(t3.url, void 0) }));
        ((t4) => {
          if (!t4 || "object" != typeof t4) return false;
          var e4 = "name" in t4 ? String(t4.name) : "";
          return x(t4) || e4 === y;
        })(e3) && (sn = true), a2(s2);
      })) : a2(s2);
    })(f({}, t2, { callback: (e2) => {
      var i2, r2;
      this.rateLimiter.checkForLimiting(e2), 400 > e2.statusCode || null == (i2 = (r2 = this.config).on_request_error) || i2.call(r2, e2), null == t2.callback || t2.callback(e2);
    } }))));
  }
  Zi(t2) {
    this.Gi ? this.Gi.retriableRequest(t2) : this._send_request(t2);
  }
  _execute_array(t2) {
    Bn++;
    try {
      var e2, i2 = [], r2 = [], s2 = [];
      Ki(t2, ((t3) => {
        if (t3) if (M(e2 = t3[0])) s2.push(t3);
        else if (D(t3)) try {
          t3.call(this);
        } catch (e3) {
          Ne.error("Error executing queued PostHog call", t3, e3);
        }
        else M(t3) && "alias" === e2 ? i2.push(t3) : M(t3) && -1 !== e2.indexOf("capture") && D(this[e2]) ? s2.push(t3) : r2.push(t3);
      }));
      var n2 = function(t3, e3) {
        Ki(t3, (function(t4) {
          try {
            if (M(t4[0])) {
              var i3 = e3;
              Xi(t4, (function(t5) {
                i3 = i3[t5[0]].apply(i3, t5.slice(1));
              }));
            } else e3[t4[0]].apply(e3, t4.slice(1));
          } catch (e4) {
            Ne.error("Error executing queued PostHog call", t4, e4);
          }
        }));
      };
      n2(i2, this), n2(r2, this), n2(s2, this);
    } finally {
      Bn--;
    }
  }
  push(t2) {
    if (Bn > 0 && M(t2) && j(t2[0])) {
      var e2 = to.prototype[t2[0]];
      D(e2) && e2.apply(this, t2.slice(1));
    } else this._execute_array([t2]);
  }
  capture(t2, e2, i2) {
    var r2, s2, n2, o2, a2;
    if (this.__loaded && this.persistence && this.sessionPersistence && this.Wi) {
      if (this.is_capturing()) if (!N(t2) && j(t2)) {
        var l2 = !this.config.opt_out_useragent_filter && this._is_bot();
        if (!l2 || this.config.__preview_capture_bot_pageviews) {
          var u2 = null != i2 && i2.skip_client_rate_limiting ? void 0 : this.rateLimiter.clientRateLimitContext();
          if (null == u2 || !u2.isRateLimited) {
            null != e2 && e2.$current_url && !j(null == e2 ? void 0 : e2.$current_url) && (Ne.error("Invalid `$current_url` property provided to `posthog.capture`. Input must be a string. Ignoring provided value."), null == e2 || delete e2.$current_url), "$exception" !== t2 || null != i2 && i2.sn || Ne.warn("Using `posthog.capture('$exception')` is unreliable because it does not attach required metadata. Use `posthog.captureException(error)` instead, which attaches required metadata automatically."), this.sessionPersistence.update_search_keyword(), this.config.save_campaign_params && this.sessionPersistence.update_campaign_params(), this.config.save_referrer && this.sessionPersistence.update_referrer_info(), (this.config.save_campaign_params || this.config.save_referrer) && this.persistence.set_initial_person_info();
            var h2 = /* @__PURE__ */ new Date(), d2 = (null == i2 ? void 0 : i2.timestamp) || h2, v2 = (null == i2 ? void 0 : i2.uuid) || vr(), c2 = { uuid: v2, event: t2, properties: this.calculateEventProperties(t2, e2 || {}, d2, v2) };
            t2 === Wi && this.config.__preview_capture_bot_pageviews && l2 && (c2.event = "$bot_pageview", c2.properties.$browser_type = "bot"), u2 && (c2.properties.$lib_rate_limit_remaining_tokens = u2.remainingTokens), (null == i2 ? void 0 : i2.$set) && (c2.$set = null == i2 ? void 0 : i2.$set);
            var p2, _2, g2, m2 = this.an(null == i2 ? void 0 : i2.$set_once, t2 !== Ji, t2 === Yi);
            if (m2 && (c2.$set_once = m2), null != i2 && i2._noTruncate || (s2 = this.config.properties_string_max_length, n2 = c2, o2 = (t3) => j(t3) ? t3.slice(0, s2) : t3, a2 = /* @__PURE__ */ new Set(), c2 = (function t3(e3, i3) {
              return e3 !== Object(e3) ? o2 ? o2(e3) : e3 : a2.has(e3) ? void 0 : (a2.add(e3), M(e3) ? (r3 = [], Ki(e3, ((e4) => {
                r3.push(t3(e4));
              }))) : (r3 = {}, Xi(e3, ((e4, i4) => {
                a2.has(e4) || (r3[i4] = t3(e4));
              }))), r3);
              var r3;
            })(n2)), c2.timestamp = d2, N(null == i2 ? void 0 : i2.timestamp) || (c2.properties.$event_time_override_provided = true, c2.properties.$event_time_override_system_time = h2), t2 === ds.DISMISSED || t2 === ds.SENT) {
              var b2 = null == e2 ? void 0 : e2[vs.SURVEY_ID], y2 = null == e2 ? void 0 : e2[vs.SURVEY_ITERATION];
              ((t3) => {
                try {
                  var e3 = ((t4) => ((t5, e4) => {
                    var i3 = "" + Fn + e4.id;
                    return e4.current_iteration && e4.current_iteration > 0 && (i3 = "" + Fn + e4.id + "_" + e4.current_iteration), i3;
                  })(0, t4))(t3);
                  if (localStorage.getItem(e3)) return;
                  localStorage.setItem(e3, "true");
                } catch (t4) {
                  An.error("Failed to persist survey seen state", t4);
                }
              })({ id: b2, current_iteration: y2 }), c2.$set = f({}, c2.$set, { [(p2 = { id: b2, current_iteration: y2 }, _2 = t2 === ds.SENT ? "responded" : "dismissed", g2 = "$survey_" + _2 + "/" + p2.id, p2.current_iteration && p2.current_iteration > 0 && (g2 = "$survey_" + _2 + "/" + p2.id + "/" + p2.current_iteration), g2)]: true });
            } else t2 === ds.SHOWN && (c2.$set = f({}, c2.$set, { [vs.SURVEY_LAST_SEEN_DATE]: (/* @__PURE__ */ new Date()).toISOString() }));
            if (t2 === fs.SHOWN) {
              var w2 = null == e2 ? void 0 : e2[_s.TOUR_TYPE];
              w2 && (c2.$set = f({}, c2.$set, { [_s.TOUR_LAST_SEEN_DATE + "/" + w2]: (/* @__PURE__ */ new Date()).toISOString() }));
            }
            var x2 = f({}, c2.properties.$set, c2.$set);
            if (L(x2) || this.setPersonPropertiesForFlags(x2), !H(this.config.before_send)) {
              var E2 = this.un(c2);
              if (!E2) return;
              c2 = E2;
            }
            this.$i.emit("eventCaptured", c2);
            var S2 = { method: "POST", url: null !== (r2 = null == i2 ? void 0 : i2._url) && void 0 !== r2 ? r2 : this.requestRouter.endpointFor("api", this.analyticsDefaultEndpoint), data: c2, compression: "best-available", batchKey: null == i2 ? void 0 : i2._batchKey, transport: null == i2 ? void 0 : i2.transport };
            return !this.config.request_batching || i2 && (null == i2 || !i2._batchKey) || null != i2 && i2.send_instantly ? this.Zi(S2) : this.Wi.enqueue(S2), c2;
          }
          Ne.critical("This capture call is ignored due to client rate limiting.");
        }
      } else Ne.error("No event name provided to posthog.capture");
    } else Ne.uninitializedWarning("posthog.capture");
  }
  _addCaptureHook(t2) {
    return this.on("eventCaptured", ((e2) => t2(e2.event, e2)));
  }
  calculateEventProperties(e2, i2, n2, o2, a2) {
    if (n2 = n2 || /* @__PURE__ */ new Date(), !this.persistence || !this.sessionPersistence) return i2;
    var l2 = a2 ? void 0 : this.persistence.remove_event_timer(e2), h2 = f({}, i2);
    if (h2.token = this.config.token, h2.$config_defaults = this.config.defaults, this.Ai() && (h2.$cookieless_mode = true), "$snapshot" === e2) {
      var d2 = f({}, this.persistence.properties(), this.sessionPersistence.properties());
      return h2.distinct_id = d2.distinct_id, (!j(h2.distinct_id) && !q(h2.distinct_id) || z(h2.distinct_id)) && Ne.error("Invalid distinct_id for replay event. This indicates a bug in your implementation"), h2;
    }
    var c2, p2 = (function(e3, i3) {
      var r2, n3, o3, a3;
      if (!u) return {};
      var l3, h3, d3, c3, p3, f2, _3, g3, m3 = e3 ? [...zr, ...i3 || []] : [], [b3, y3] = (function(t2) {
        for (var e4 = 0; te.length > e4; e4++) {
          var [i4, r3] = te[e4], s2 = i4.exec(t2), n4 = s2 && (D(r3) ? r3(s2, t2) : r3);
          if (n4) return n4;
        }
        return ["", ""];
      })(u);
      return Qi(ir({ $os: b3, $os_version: y3, $browser: Xt(u, navigator.vendor), $device: ee(u), $device_type: (h3 = u, d3 = { userAgentDataPlatform: null == (r2 = navigator) || null == (r2 = r2.userAgentData) ? void 0 : r2.platform, maxTouchPoints: null == (n3 = navigator) ? void 0 : n3.maxTouchPoints, screenWidth: null == t || null == (o3 = t.screen) ? void 0 : o3.width, screenHeight: null == t || null == (a3 = t.screen) ? void 0 : a3.height, devicePixelRatio: null == t ? void 0 : t.devicePixelRatio }, g3 = ee(h3), g3 === dt || g3 === ht || "Kobo" === g3 || "Kindle Fire" === g3 || g3 === zt ? ut : g3 === Ot || g3 === Ct || g3 === It || g3 === Lt ? "Console" : g3 === ct ? "Wearable" : g3 ? ot : "Android" === (null == d3 ? void 0 : d3.userAgentDataPlatform) && (null !== (c3 = null == d3 ? void 0 : d3.maxTouchPoints) && void 0 !== c3 ? c3 : 0) > 0 ? 600 > Math.min(null !== (p3 = null == d3 ? void 0 : d3.screenWidth) && void 0 !== p3 ? p3 : 0, null !== (f2 = null == d3 ? void 0 : d3.screenHeight) && void 0 !== f2 ? f2 : 0) / (null !== (_3 = null == d3 ? void 0 : d3.devicePixelRatio) && void 0 !== _3 ? _3 : 1) ? ot : ut : "Desktop"), $timezone: Zr(), $timezone_offset: ts() }), { $current_url: Lr(null == s ? void 0 : s.href, m3, Hr), $host: null == s ? void 0 : s.host, $pathname: null == s ? void 0 : s.pathname, $raw_user_agent: u.length > 1e3 ? u.substring(0, 997) + "..." : u, $browser_version: Zt(u, navigator.vendor), $browser_language: Yr(), $browser_language_prefix: (l3 = Yr(), "string" == typeof l3 ? l3.split("-")[0] : void 0), $screen_height: null == t ? void 0 : t.screen.height, $screen_width: null == t ? void 0 : t.screen.width, $viewport_height: null == t ? void 0 : t.innerHeight, $viewport_width: null == t ? void 0 : t.innerWidth, $lib: v.LIB_NAME, $lib_version: v.LIB_VERSION, $insert_id: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10), $time: Date.now() / 1e3 });
    })(this.config.mask_personal_data_properties, this.config.custom_personal_data_properties);
    if (this.sessionManager) {
      var { sessionId: _2, windowId: g2 } = this.sessionManager.checkAndGetSessionAndWindowId(a2, n2.getTime());
      h2.$session_id = _2, h2.$window_id = g2;
    }
    this.sessionPropsManager && Qi(h2, this.sessionPropsManager.getSessionProps());
    try {
      var m2;
      this.sessionRecording && Qi(h2, this.sessionRecording.sdkDebugProperties), h2.$sdk_debug_retry_queue_size = null == (m2 = this.Gi) ? void 0 : m2.length;
    } catch (t2) {
      h2.$sdk_debug_error_capturing_properties = String(t2);
    }
    if (this.requestRouter.region === Pn && (h2.$lib_custom_api_host = this.config.api_host), c2 = e2 !== Wi || a2 ? e2 !== Gi || a2 ? this.pageViewManager.doEvent() : this.pageViewManager.doPageLeave(n2) : this.pageViewManager.doPageView(n2, o2), h2 = Qi(h2, c2), e2 === Wi && r && (h2.title = r.title), !N(l2)) {
      var b2 = n2.getTime() - l2;
      h2.$duration = parseFloat((b2 / 1e3).toFixed(3));
    }
    u && this.config.opt_out_useragent_filter && (h2.$browser_type = this._is_bot() ? "bot" : "browser"), (h2 = Qi({}, p2, this.persistence.properties(), this.sessionPersistence.properties(), h2)).$is_identified = this._isIdentified(), M(this.config.property_denylist) ? Xi(this.config.property_denylist, (function(t2) {
      delete h2[t2];
    })) : Ne.error(Gn + this.config.property_denylist + " or property_blacklist config: " + this.config.property_blacklist);
    var y2 = this.config.sanitize_properties;
    y2 && (Ne.error(Wn), h2 = y2(h2, e2));
    var w2 = this.ln();
    return h2.$process_person_profile = w2, w2 && !a2 && this.hn("_calculate_event_properties"), h2;
  }
  an(t2, e2, i2) {
    var r2;
    if (void 0 === e2 && (e2 = true), void 0 === i2 && (i2 = false), !this.persistence || !this.ln()) return t2;
    if (this.Ni && !i2) return t2;
    var s2 = this.persistence.get_initial_props(), n2 = null == (r2 = this.sessionPropsManager) ? void 0 : r2.getSetOnceProps(), o2 = Qi({}, s2, n2 || {}, t2 || {}), a2 = this.config.sanitize_properties;
    return a2 && (Ne.error(Wn), o2 = a2(o2, "$set_once")), e2 && (this.Ni = true), L(o2) ? void 0 : o2;
  }
  register(t2, e2) {
    var i2;
    null == (i2 = this.persistence) || i2.register(t2, e2);
  }
  register_once(t2, e2, i2) {
    var r2;
    null == (r2 = this.persistence) || r2.register_once(t2, e2, i2);
  }
  register_for_session(t2) {
    var e2;
    null == (e2 = this.sessionPersistence) || e2.register(t2);
  }
  unregister(t2) {
    var e2;
    null == (e2 = this.persistence) || e2.unregister(t2);
  }
  unregister_for_session(t2) {
    var e2;
    null == (e2 = this.sessionPersistence) || e2.unregister(t2);
  }
  cn(t2, e2) {
    this.register({ [t2]: e2 });
  }
  getFeatureFlag(t2, e2) {
    var i2;
    return null == (i2 = this.featureFlags) ? void 0 : i2.getFeatureFlag(t2, e2);
  }
  getFeatureFlagPayload(t2) {
    var e2;
    return null == (e2 = this.featureFlags) ? void 0 : e2.getFeatureFlagPayload(t2);
  }
  getFeatureFlagResult(t2, e2) {
    var i2;
    return null == (i2 = this.featureFlags) ? void 0 : i2.getFeatureFlagResult(t2, e2);
  }
  isFeatureEnabled(t2, e2) {
    var i2;
    return null == (i2 = this.featureFlags) ? void 0 : i2.isFeatureEnabled(t2, e2);
  }
  reloadFeatureFlags() {
    var t2;
    null == (t2 = this.featureFlags) || t2.reloadFeatureFlags();
  }
  updateFlags(t2, e2, i2) {
    var r2;
    null == (r2 = this.featureFlags) || r2.updateFlags(t2, e2, i2);
  }
  updateEarlyAccessFeatureEnrollment(t2, e2, i2) {
    var r2;
    null == (r2 = this.featureFlags) || r2.updateEarlyAccessFeatureEnrollment(t2, e2, i2);
  }
  getEarlyAccessFeatures(t2, e2, i2) {
    var r2;
    return void 0 === e2 && (e2 = false), null == (r2 = this.featureFlags) ? void 0 : r2.getEarlyAccessFeatures(t2, e2, i2);
  }
  on(t2, e2) {
    return this.$i.on(t2, e2);
  }
  onFeatureFlags(t2) {
    return this.featureFlags ? this.featureFlags.onFeatureFlags(t2) : (t2([], {}, { errorsLoading: true }), () => {
    });
  }
  onSurveysLoaded(t2) {
    return this.surveys ? this.surveys.onSurveysLoaded(t2) : (t2([], { isLoaded: false, error: Vn }), () => {
    });
  }
  onSessionId(t2) {
    var e2, i2;
    return null !== (e2 = null == (i2 = this.sessionManager) ? void 0 : i2.onSessionId(t2)) && void 0 !== e2 ? e2 : () => {
    };
  }
  getSurveys(t2, e2) {
    void 0 === e2 && (e2 = false), this.surveys ? this.surveys.getSurveys(t2, e2) : t2([], { isLoaded: false, error: Vn });
  }
  getActiveMatchingSurveys(t2, e2) {
    void 0 === e2 && (e2 = false), this.surveys ? this.surveys.getActiveMatchingSurveys(t2, e2) : t2([], { isLoaded: false, error: Vn });
  }
  renderSurvey(t2, e2) {
    var i2;
    null == (i2 = this.surveys) || i2.renderSurvey(t2, e2);
  }
  displaySurvey(t2, e2) {
    var i2;
    void 0 === e2 && (e2 = Dn), null == (i2 = this.surveys) || i2.displaySurvey(t2, e2);
  }
  cancelPendingSurvey(t2) {
    var e2;
    null == (e2 = this.surveys) || e2.cancelPendingSurvey(t2);
  }
  canRenderSurvey(t2) {
    var e2, i2;
    return null !== (e2 = null == (i2 = this.surveys) ? void 0 : i2.canRenderSurvey(t2)) && void 0 !== e2 ? e2 : { visible: false, disabledReason: Vn };
  }
  canRenderSurveyAsync(t2, e2) {
    var i2, r2;
    return void 0 === e2 && (e2 = false), null !== (i2 = null == (r2 = this.surveys) ? void 0 : r2.canRenderSurveyAsync(t2, e2)) && void 0 !== i2 ? i2 : Promise.resolve({ visible: false, disabledReason: Vn });
  }
  dn(t2) {
    return !t2 || z(t2) ? (Ne.critical("Unique user id has not been set in posthog.identify"), false) : t2 === Fi ? (Ne.critical('The string "' + t2 + '" was set in posthog.identify which indicates an error. This ID is only used as a sentinel value.'), false) : !["distinct_id", "distinctid"].includes(t2.toLowerCase()) && !["undefined", "null"].includes(t2.toLowerCase()) || (Ne.critical('The string "' + t2 + '" was set in posthog.identify which indicates an error. This ID should be unique to the user and not a hardcoded string.'), false);
  }
  identify(t2, e2, i2) {
    if (!this.__loaded || !this.persistence) return Ne.uninitializedWarning("posthog.identify");
    if (q(t2) && (t2 = t2.toString(), Ne.warn("The first argument to posthog.identify was a number, but it should be a string. It has been converted to a string.")), this.dn(t2) && this.hn("posthog.identify")) {
      var r2 = this.get_distinct_id();
      this.register({ $user_id: t2 }), this.get_property(qe) || this.register_once({ $had_persisted_distinct_id: true, $device_id: r2 }, ""), t2 !== r2 && t2 !== this.get_property(Ve) && (this.unregister(Ve), this.register({ distinct_id: t2 }));
      var s2, n2 = (this.persistence.get_property(Ti) || zi) === zi;
      t2 !== r2 && n2 ? (this.persistence.set_property(Ti, Bi), this.setPersonPropertiesForFlags({ $set: e2 || {}, $set_once: i2 || {} }, false), this.capture(Yi, { distinct_id: t2, $anon_distinct_id: r2 }, { $set: e2 || {}, $set_once: i2 || {} }), this.Hi = $n(t2, e2, i2), null == (s2 = this.featureFlags) || s2.setAnonymousDistinctId(r2)) : (e2 || i2) && this.setPersonProperties(e2, i2), t2 !== r2 && (this.reloadFeatureFlags(), this.unregister(xi));
    }
  }
  setPersonProperties(t2, e2) {
    if ((t2 || e2) && this.hn("posthog.setPersonProperties")) {
      var i2 = $n(this.get_distinct_id(), t2, e2);
      this.Hi !== i2 ? (this.setPersonPropertiesForFlags({ $set: t2 || {}, $set_once: e2 || {} }, true), this.capture("$set", { $set: t2 || {}, $set_once: e2 || {} }), this.Hi = i2) : Ne.info("A duplicate setPersonProperties call was made with the same properties. It has been ignored.");
    }
  }
  group(t2, e2, i2) {
    if (t2 && e2) {
      var r2 = this.getGroups(), s2 = r2[t2] !== e2;
      if (s2 && this.resetGroupPropertiesForFlags(t2), this.register({ $groups: f({}, r2, { [t2]: e2 }) }), s2 || i2) {
        var n2 = { $group_type: t2, $group_key: e2 };
        i2 && (n2.$group_set = i2), this.capture(Ji, n2);
      }
      i2 && this.setGroupPropertiesForFlags({ [t2]: i2 }), s2 && !i2 && this.reloadFeatureFlags();
    } else Ne.error("posthog.group requires a group type and group key");
  }
  resetGroups() {
    this.register({ $groups: {} }), this.resetGroupPropertiesForFlags(), this.reloadFeatureFlags();
  }
  setPersonPropertiesForFlags(t2, e2) {
    var i2;
    void 0 === e2 && (e2 = true), null == (i2 = this.featureFlags) || i2.setPersonPropertiesForFlags(t2, e2);
  }
  resetPersonPropertiesForFlags() {
    var t2;
    null == (t2 = this.featureFlags) || t2.resetPersonPropertiesForFlags();
  }
  setGroupPropertiesForFlags(t2, e2) {
    var i2;
    void 0 === e2 && (e2 = true), this.hn("posthog.setGroupPropertiesForFlags") && (null == (i2 = this.featureFlags) || i2.setGroupPropertiesForFlags(t2, e2));
  }
  resetGroupPropertiesForFlags(t2) {
    var e2;
    null == (e2 = this.featureFlags) || e2.resetGroupPropertiesForFlags(t2);
  }
  reset(t2) {
    var e2, i2, r2, s2, n2, o2, a2, l2;
    if (Ne.info("reset"), !this.__loaded) return Ne.uninitializedWarning("posthog.reset");
    var u2, h2 = this.get_property(qe), d2 = this.get_property(ii);
    if (this.consent.reset(), null == (e2 = this.persistence) || e2.clear(), null == (i2 = this.sessionPersistence) || i2.clear(), N(d2) || null == (u2 = this.persistence) || u2.register({ [ii]: d2 }), null == (r2 = this.surveys) || r2.reset(), null == (s2 = this.rn) || s2.stop(), null == (n2 = this.featureFlags) || n2.reset(), null == (o2 = this.conversations) || o2.reset(), null == (a2 = this.persistence) || a2.set_property(Ti, zi), null == (l2 = this.sessionManager) || l2.resetSessionId(), this.Hi = null, this.config.cookieless_mode === ji) this.register_once({ distinct_id: Fi, $device_id: null }, "");
    else {
      var v2 = this.config.get_device_id(vr());
      this.register_once({ distinct_id: v2, $device_id: t2 ? v2 : h2 }, "");
    }
    this.register({ $last_posthog_reset: (/* @__PURE__ */ new Date()).toISOString() }, 1), delete this.config.identity_distinct_id, delete this.config.identity_hash, this.reloadFeatureFlags();
  }
  setIdentity(t2, e2) {
    var i2;
    this.config.identity_distinct_id = t2, this.config.identity_hash = e2, this.alias(t2), null == (i2 = this.conversations) || i2.vn();
  }
  clearIdentity() {
    var t2;
    delete this.config.identity_distinct_id, delete this.config.identity_hash, null == (t2 = this.conversations) || t2.fn();
  }
  get_distinct_id() {
    return this.get_property("distinct_id");
  }
  getGroups() {
    return this.get_property("$groups") || {};
  }
  get_session_id() {
    var t2, e2;
    return null !== (t2 = null == (e2 = this.sessionManager) ? void 0 : e2.checkAndGetSessionAndWindowId(true).sessionId) && void 0 !== t2 ? t2 : "";
  }
  get_session_replay_url(t2) {
    if (!this.sessionManager) return "";
    var { sessionId: e2, sessionStartTimestamp: i2 } = this.sessionManager.checkAndGetSessionAndWindowId(true), r2 = this.requestRouter.endpointFor("ui", "/project/" + this.config.token + "/replay/" + e2);
    if (null != t2 && t2.withTimestamp && i2) {
      var s2, n2 = null !== (s2 = t2.timestampLookBack) && void 0 !== s2 ? s2 : 10;
      if (!i2) return r2;
      r2 += "?t=" + Math.max(Math.floor(((/* @__PURE__ */ new Date()).getTime() - i2) / 1e3) - n2, 0);
    }
    return r2;
  }
  alias(t2, e2) {
    return t2 === this.get_property(He) ? (Ne.critical("Attempting to create alias for existing People user - aborting."), -2) : this.hn("posthog.alias") ? (N(e2) && (e2 = this.get_distinct_id()), t2 !== e2 ? (this.cn(Ve, t2), this.capture("$create_alias", { alias: t2, distinct_id: e2 })) : (Ne.warn("alias matches current distinct_id - skipping api call."), this.identify(t2), -1)) : void 0;
  }
  set_config(t2) {
    var e2 = f({}, this.config);
    if (U(t2)) {
      var i2, r2, s2, n2, o2, a2, l2, u2, h2, d2;
      Qi(this.config, Qn(t2));
      var c2 = this.Vi();
      null == (i2 = this.persistence) || i2.update_config(this.config, e2, c2), this.sessionPersistence = "sessionStorage" === this.config.persistence || "memory" === this.config.persistence ? this.persistence : new is(f({}, this.config, { persistence: "sessionStorage" }), c2);
      var p2 = this.Ui(this.config.debug);
      W(p2) && (this.config.debug = p2), W(this.config.debug) && (this.config.debug ? (v.DEBUG = true, mr.R() && mr.N("ph_debug", true), Ne.info("set_config", { config: t2, oldConfig: e2, newConfig: f({}, this.config) })) : (v.DEBUG = false, mr.R() && mr.q("ph_debug"))), null == (r2 = this.exceptionObserver) || r2.onConfigChange(), null == (s2 = this.exceptions) || s2.onConfigChange(), null == (n2 = this.sessionRecording) || n2.startIfEnabledOrStop(), null == (o2 = this.autocapture) || o2.startIfEnabled(), null == (a2 = this.heatmaps) || a2.startIfEnabled(), null == (l2 = this.exceptionObserver) || l2.startIfEnabledOrStop(), null == (u2 = this.deadClicksAutocapture) || u2.startIfEnabledOrStop(), null == (h2 = this.surveys) || h2.loadIfEnabled(), this.pn(), null == (d2 = this.externalIntegrations) || d2.startIfEnabledOrStop();
    }
  }
  _overrideSDKInfo(t2, e2) {
    v.LIB_NAME = t2, v.LIB_VERSION = e2;
  }
  startSessionRecording(t2) {
    var e2, i2, r2, s2, n2, o2 = true === t2, a2 = { sampling: o2 || !(null == t2 || !t2.sampling), linked_flag: o2 || !(null == t2 || !t2.linked_flag), url_trigger: o2 || !(null == t2 || !t2.url_trigger), event_trigger: o2 || !(null == t2 || !t2.event_trigger) };
    Object.values(a2).some(Boolean) && (null == (e2 = this.sessionManager) || e2.checkAndGetSessionAndWindowId(), a2.sampling && (null == (i2 = this.sessionRecording) || i2.overrideSampling()), a2.linked_flag && (null == (r2 = this.sessionRecording) || r2.overrideLinkedFlag()), a2.url_trigger && (null == (s2 = this.sessionRecording) || s2.overrideTrigger("url")), a2.event_trigger && (null == (n2 = this.sessionRecording) || n2.overrideTrigger("event")));
    this.set_config({ disable_session_recording: false });
  }
  stopSessionRecording() {
    this.set_config({ disable_session_recording: true });
  }
  sessionRecordingStarted() {
    var t2;
    return !(null == (t2 = this.sessionRecording) || !t2.started);
  }
  captureException(t2, e2) {
    if (this.exceptions) {
      var i2 = new Error("PostHog syntheticException"), r2 = this.exceptions.buildProperties(t2, { handled: true, syntheticException: i2 });
      return this.exceptions.sendExceptionEvent(f({}, r2, e2));
    }
  }
  addExceptionStep(t2, e2) {
    var i2;
    null == (i2 = this.exceptions) || i2.addExceptionStep(t2, e2);
  }
  captureLog(t2) {
    var e2;
    null == (e2 = this.logs) || e2.captureLog(t2);
  }
  get logger() {
    var t2, e2;
    return null !== (t2 = null == (e2 = this.logs) ? void 0 : e2.logger) && void 0 !== t2 ? t2 : to.gn;
  }
  startExceptionAutocapture(t2) {
    this.set_config({ capture_exceptions: null == t2 || t2 });
  }
  stopExceptionAutocapture() {
    this.set_config({ capture_exceptions: false });
  }
  loadToolbar(t2) {
    var e2, i2;
    return null !== (e2 = null == (i2 = this.toolbar) ? void 0 : i2.loadToolbar(t2)) && void 0 !== e2 && e2;
  }
  get_property(t2) {
    var e2;
    return null == (e2 = this.persistence) ? void 0 : e2.props[t2];
  }
  getSessionProperty(t2) {
    var e2;
    return null == (e2 = this.sessionPersistence) ? void 0 : e2.props[t2];
  }
  toString() {
    var t2, e2 = null !== (t2 = this.config.name) && void 0 !== t2 ? t2 : Yn;
    return e2 !== Yn && (e2 = Yn + "." + e2), e2;
  }
  _isIdentified() {
    var t2, e2;
    return (null == (t2 = this.persistence) ? void 0 : t2.get_property(Ti)) === Bi || (null == (e2 = this.sessionPersistence) ? void 0 : e2.get_property(Ti)) === Bi;
  }
  ln() {
    var t2, e2;
    return !("never" === this.config.person_profiles || this.config.person_profiles === Hi && !this._isIdentified() && L(this.getGroups()) && (null == (t2 = this.persistence) || null == (t2 = t2.props) || !t2[Ve]) && (null == (e2 = this.persistence) || null == (e2 = e2.props) || !e2[Ci]));
  }
  nn() {
    return true === this.config.capture_pageleave || "if_capture_pageview" === this.config.capture_pageleave && (true === this.config.capture_pageview || "history_change" === this.config.capture_pageview);
  }
  createPersonProfile() {
    this.ln() || this.hn("posthog.createPersonProfile") && this.setPersonProperties({}, {});
  }
  setInternalOrTestUser() {
    this.hn("posthog.setInternalOrTestUser") && this.setPersonProperties({ $internal_or_test_user: true });
  }
  hn(t2) {
    return "never" === this.config.person_profiles ? (Ne.error(t2 + ' was called, but process_person is set to "never". This call will be ignored.'), false) : (this.cn(Ci, true), true);
  }
  Vi() {
    if ("always" === this.config.cookieless_mode) return true;
    var t2 = this.consent.isOptedOut();
    return this.config.disable_persistence || t2 && !(!this.config.opt_out_persistence_by_default && this.config.cookieless_mode !== Ni);
  }
  pn() {
    var t2, e2, i2, r2, s2 = this.Vi();
    return (null == (t2 = this.persistence) ? void 0 : t2._r) !== s2 && (null == (i2 = this.persistence) || i2.set_disabled(s2)), (null == (e2 = this.sessionPersistence) ? void 0 : e2._r) !== s2 && (null == (r2 = this.sessionPersistence) || r2.set_disabled(s2)), s2;
  }
  opt_in_capturing(t2) {
    var e2;
    if (this.config.cookieless_mode !== ji) {
      if (this.Ai()) {
        var i2, r2, s2, n2, o2;
        this.reset(true), null == (i2 = this.sessionManager) || i2.destroy(), null == (r2 = this.pageViewManager) || r2.destroy(), this.sessionManager = new xn(this), this.pageViewManager = new Ar(this), this.persistence && (this.sessionPropsManager = new bn(this, this.sessionManager, this.persistence));
        var a2, l2 = null !== (s2 = null == (n2 = this.config.__extensionClasses) ? void 0 : n2.sessionRecording) && void 0 !== s2 ? s2 : null == (o2 = to.__defaultExtensionClasses) ? void 0 : o2.sessionRecording;
        l2 && (this.sessionRecording = this.Li(this.sessionRecording, new l2(this)), this.Xi && (null == (a2 = this.sessionRecording) || null == a2.onRemoteConfig || a2.onRemoteConfig(this.Xi)));
      }
      var u2, h2;
      this.consent.optInOut(true), this.pn(), this.tn(), null == (e2 = this.sessionRecording) || e2.startIfEnabledOrStop(), this.config.cookieless_mode == Ni && (null == (u2 = this.surveys) || u2.loadIfEnabled()), (N(null == t2 ? void 0 : t2.captureEventName) || null != t2 && t2.captureEventName) && this.capture(null !== (h2 = null == t2 ? void 0 : t2.captureEventName) && void 0 !== h2 ? h2 : "$opt_in", null == t2 ? void 0 : t2.captureProperties, { send_instantly: true }), this.config.capture_pageview && this.en();
    } else Ne.warn(qn);
  }
  opt_out_capturing() {
    var t2, e2, i2;
    this.config.cookieless_mode !== ji ? (this.config.cookieless_mode === Ni && this.consent.isOptedIn() && this.reset(true), this.consent.optInOut(false), this.pn(), this.config.cookieless_mode === Ni && (this.register({ distinct_id: Fi, $device_id: null }), null == (t2 = this.sessionRecording) || t2.stopRecording(), this.sessionRecording = void 0, null == (e2 = this.sessionManager) || e2.destroy(), null == (i2 = this.pageViewManager) || i2.destroy(), this.sessionManager = void 0, this.sessionPropsManager = void 0, this.en(), this.tn())) : Ne.warn(qn);
  }
  has_opted_in_capturing() {
    return this.consent.isOptedIn();
  }
  has_opted_out_capturing() {
    return this.consent.isOptedOut();
  }
  get_explicit_consent_status() {
    var t2 = this.consent.consent;
    return 1 === t2 ? "granted" : 0 === t2 ? "denied" : "pending";
  }
  is_capturing() {
    return this.config.cookieless_mode === ji || (this.config.cookieless_mode === Ni ? this.consent.isRejected() || this.consent.isOptedIn() : !this.has_opted_out_capturing());
  }
  clear_opt_in_out_capturing() {
    this.consent.reset(), this.pn();
  }
  _is_bot() {
    return i ? En(i, this.config.custom_blocked_useragents) : void 0;
  }
  en() {
    r && ("visible" === r.visibilityState ? this.Di || (this.Di = true, this.capture(Wi, { title: r.title }, { send_instantly: true }), this.qi && (r.removeEventListener(qi, this.qi), this.qi = null)) : this.qi || (this.qi = this.en.bind(this), nr(r, qi, this.qi)));
  }
  debug(e2) {
    false === e2 ? (null == t || t.console.log("You've disabled debug mode."), this.set_config({ debug: false })) : (null == t || t.console.log("You're now in debug mode. All calls to PostHog will be logged in your console.\nYou can disable this with `posthog.debug(false)`."), this.set_config({ debug: true }));
  }
  Lr() {
    var t2, e2, i2, r2, s2, n2, o2 = this.Bi || {};
    return "advanced_disable_flags" in o2 ? !!o2.advanced_disable_flags : false !== this.config.advanced_disable_flags ? !!this.config.advanced_disable_flags : true === this.config.advanced_disable_decide ? (Ne.warn("Config field 'advanced_disable_decide' is deprecated. Please use 'advanced_disable_flags' instead. The old field will be removed in a future major version."), true) : (i2 = "advanced_disable_decide", r2 = Ne, s2 = (e2 = "advanced_disable_flags") in (t2 = o2) && !H(t2[e2]), n2 = i2 in t2 && !H(t2[i2]), s2 ? t2[e2] : !!n2 && (r2 && r2.warn("Config field '" + i2 + "' is deprecated. Please use '" + e2 + "' instead. The old field will be removed in a future major version."), t2[i2]));
  }
  un(t2) {
    if (H(this.config.before_send)) return t2;
    var e2 = M(this.config.before_send) ? this.config.before_send : [this.config.before_send], i2 = t2;
    for (var r2 of e2) {
      if (i2 = r2(i2), H(i2)) {
        var s2 = "Event '" + t2.event + "' was rejected in beforeSend function";
        return Y(t2.event) ? Ne.warn(s2 + ". This can cause unexpected behavior.") : Ne.info(s2), null;
      }
      i2.properties && !L(i2.properties) || Ne.warn("Event '" + t2.event + "' has no properties after beforeSend function, this is likely an error.");
    }
    return i2;
  }
  getPageViewId() {
    var t2;
    return null == (t2 = this.pageViewManager.dr) ? void 0 : t2.pageViewId;
  }
  captureTraceFeedback(t2, e2) {
    this.capture("$ai_feedback", { $ai_trace_id: String(t2), $ai_feedback_text: e2 });
  }
  captureTraceMetric(t2, e2, i2) {
    this.capture("$ai_metric", { $ai_trace_id: String(t2), $ai_metric_name: e2, $ai_metric_value: String(i2) });
  }
  Ui(t2) {
    var e2 = W(t2) && !t2, i2 = mr.R() && "true" === mr.A("ph_debug");
    return !e2 && (!!i2 || t2);
  }
}
to.__defaultExtensionClasses = {}, to.gn = { trace: jn = () => {
}, debug: jn, info: jn, warn: jn, error: jn, fatal: jn }, (function(t2, e2) {
  for (var i2 = 0; e2.length > i2; i2++) t2.prototype[e2[i2]] = er(t2.prototype[e2[i2]]);
})(to, ["identify"]);
var eo = 1, io = 3, ro = 11;
function so(t2) {
  return t2 instanceof Element && (t2.id === Ai || !(null == t2.closest || !t2.closest(".toolbar-global-fade-container")));
}
function no(t2) {
  return !!t2 && t2.nodeType === eo;
}
function oo(t2, e2) {
  return !!t2 && !!t2.tagName && t2.tagName.toLowerCase() === e2.toLowerCase();
}
function ao(t2) {
  return !!t2 && t2.nodeType === io;
}
function lo(t2) {
  return !!t2 && t2.nodeType === ro && no(t2.host);
}
function uo(t2) {
  return t2 ? O(t2).split(/\s+/) : [];
}
function ho(e2) {
  var i2 = null == t ? void 0 : t.location.href;
  return !!(i2 && e2 && e2.some(((t2) => i2.match(t2))));
}
function vo(t2) {
  var e2 = "";
  switch (typeof t2.className) {
    case "string":
      e2 = t2.className;
      break;
    case "object":
      e2 = (t2.className && "baseVal" in t2.className ? t2.className.baseVal : null) || t2.getAttribute("class") || "";
      break;
    default:
      e2 = "";
  }
  return uo(e2);
}
function co(t2) {
  return H(t2) ? null : O(t2).split(/(\s+)/).filter(((t3) => Io(t3))).join("").replace(/[\r\n]/g, " ").replace(/[ ]+/g, " ").substring(0, 255);
}
function po(t2) {
  var e2 = "";
  return Eo(t2) && !So(t2) && t2.childNodes && t2.childNodes.length && Xi(t2.childNodes, (function(t3) {
    var i2;
    ao(t3) && t3.textContent && (e2 += null !== (i2 = co(t3.textContent)) && void 0 !== i2 ? i2 : "");
  })), O(e2);
}
function fo(t2) {
  return N(t2.target) ? t2.srcElement || null : null != (e2 = t2.target) && e2.shadowRoot ? t2.composedPath()[0] || null : t2.target || null;
  var e2;
}
var _o = ["a", "button", "form", "input", "select", "textarea", "label"];
function go(t2, e2) {
  if (N(e2)) return true;
  var i2, r2 = function(t3) {
    if (e2.some(((e3) => t3.matches(e3)))) return { v: true };
  };
  for (var s2 of t2) if (i2 = r2(s2)) return i2.v;
  return false;
}
function mo(t2) {
  var e2 = t2.parentNode;
  return !(!e2 || !no(e2)) && e2;
}
var bo = ["next", "previous", "prev", ">", "<"], yo = [".ph-no-rageclick", ".ph-no-capture"];
var wo = (t2) => !t2 || oo(t2, "html") || !no(t2), xo = (e2, i2) => {
  if (!t || wo(e2)) return { parentIsUsefulElement: false, targetElementList: [] };
  for (var r2 = false, s2 = [e2], n2 = e2; n2.parentNode && !oo(n2, "body"); ) if (lo(n2.parentNode)) s2.push(n2.parentNode.host), n2 = n2.parentNode.host;
  else {
    var o2 = mo(n2);
    if (!o2) break;
    if (i2 || _o.indexOf(o2.tagName.toLowerCase()) > -1) r2 = true;
    else {
      var a2 = t.getComputedStyle(o2);
      a2 && "pointer" === a2.getPropertyValue("cursor") && (r2 = true);
    }
    s2.push(o2), n2 = o2;
  }
  return { parentIsUsefulElement: r2, targetElementList: s2 };
};
function Eo(t2) {
  for (var e2 = t2; e2.parentNode && !oo(e2, "body"); e2 = e2.parentNode) {
    var i2 = vo(e2);
    if (P(i2, "ph-sensitive") || P(i2, "ph-no-capture")) return false;
  }
  if (P(vo(t2), "ph-include")) return true;
  var r2 = t2.type || "";
  if (j(r2)) switch (r2.toLowerCase()) {
    case "hidden":
    case "password":
      return false;
  }
  var s2 = t2.name || t2.id || "";
  return !j(s2) || !/^cc|cardnum|ccnum|creditcard|csc|cvc|cvv|exp|pass|pwd|routing|seccode|securitycode|securitynum|socialsec|socsec|ssn/i.test(s2.replace(/[^a-zA-Z0-9]/g, ""));
}
function So(t2) {
  return !!(oo(t2, "input") && !["button", "checkbox", "submit", "reset"].includes(t2.type) || oo(t2, "select") || oo(t2, "textarea") || "true" === t2.getAttribute("contenteditable"));
}
var $o = "(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11})", To = new RegExp("^(?:" + $o + ")$"), ko = new RegExp($o), Ro = "\\d{3}-?\\d{2}-?\\d{4}", Po = new RegExp("^(" + Ro + ")$"), Oo = new RegExp("(" + Ro + ")");
function Io(t2, e2) {
  if (void 0 === e2 && (e2 = true), H(t2)) return false;
  if (j(t2)) {
    if (t2 = O(t2), (e2 ? To : ko).test((t2 || "").replace(/[- ]/g, ""))) return false;
    if ((e2 ? Po : Oo).test(t2)) return false;
  }
  return true;
}
function Co(t2) {
  var e2 = po(t2);
  return Io(e2 = (e2 + " " + Ao(t2)).trim()) ? e2 : "";
}
function Ao(t2) {
  var e2 = "";
  return t2 && t2.childNodes && t2.childNodes.length && Xi(t2.childNodes, (function(t3) {
    var i2;
    if (t3 && "span" === (null == (i2 = t3.tagName) ? void 0 : i2.toLowerCase())) try {
      var r2 = po(t3);
      e2 = (e2 + " " + r2).trim(), t3.childNodes && t3.childNodes.length && (e2 = (e2 + " " + Ao(t3)).trim());
    } catch (t4) {
      Ne.error("[AutoCapture]", t4);
    }
  })), e2;
}
function Fo(t2) {
  return t2.replace(/"|\\"/g, '\\"');
}
function Mo(t2) {
  var e2 = t2.attr__class;
  return e2 ? M(e2) ? e2 : uo(e2) : void 0;
}
class Do {
  constructor(t2) {
    this.disabled = false === t2;
    var e2 = U(t2) ? t2 : {};
    this.thresholdPx = e2.threshold_px || 30, this.timeoutMs = e2.timeout_ms || 1e3, this.clickCount = e2.click_count || 3, this.clicks = [];
  }
  isRageClick(t2, e2, i2) {
    if (this.disabled) return false;
    var r2 = this.clicks[this.clicks.length - 1];
    if (r2 && Math.abs(t2 - r2.x) + Math.abs(e2 - r2.y) < this.thresholdPx && this.timeoutMs > i2 - r2.timestamp) {
      if (this.clicks.push({ x: t2, y: e2, timestamp: i2 }), this.clicks.length === this.clickCount) return true;
    } else this.clicks = [{ x: t2, y: e2, timestamp: i2 }];
    return false;
  }
}
var Uo = "$copy_autocapture", Lo = je("[AutoCapture]");
function No(t2, e2) {
  return e2.length > t2 ? e2.slice(0, t2) + "..." : e2;
}
function jo(t2) {
  if (t2.previousElementSibling) return t2.previousElementSibling;
  var e2 = t2;
  do {
    e2 = e2.previousSibling;
  } while (e2 && !no(e2));
  return e2;
}
function zo(e2, i2) {
  var r2, s2, { e: n2, maskAllElementAttributes: o2, maskAllText: a2, elementAttributeIgnoreList: l2, elementsChainAsString: u2 } = i2;
  if (!no(e2)) return { props: {} };
  for (var h2 = [e2], d2 = e2; d2.parentNode && !oo(d2, "body"); ) if (lo(d2.parentNode)) h2.push(d2.parentNode.host), d2 = d2.parentNode.host;
  else {
    if (!no(d2.parentNode)) break;
    h2.push(d2.parentNode), d2 = d2.parentNode;
  }
  var v2, c2, p2 = [], _2 = {}, g2 = false, m2 = false;
  if (Xi(h2, ((t2) => {
    var e3 = Eo(t2);
    if (oo(t2, "a")) {
      var i3 = t2.getAttribute("href");
      g2 = e3 && !!i3 && Io(i3) && i3;
    }
    P(vo(t2), "ph-no-capture") && (m2 = true), p2.push((function(t3, e4, i4, r4) {
      var s3 = t3.tagName.toLowerCase(), n3 = { tag_name: s3 };
      _o.indexOf(s3) > -1 && !i4 && (n3.$el_text = "a" === s3.toLowerCase() || "button" === s3.toLowerCase() ? No(1024, Co(t3)) : No(1024, po(t3)));
      var o3 = vo(t3);
      o3.length > 0 && (n3.classes = o3.filter((function(t4) {
        return "" !== t4;
      }))), Xi(t3.attributes, (function(i5) {
        var s4;
        if ((!So(t3) || -1 !== ["name", "id", "class", "aria-label"].indexOf(i5.name)) && (null == r4 || !r4.includes(i5.name)) && !e4 && Io(i5.value) && (!j(s4 = i5.name) || "_ngcontent" !== s4.substring(0, 10) && "_nghost" !== s4.substring(0, 7))) {
          var o4 = i5.value;
          "class" === i5.name && (o4 = uo(o4).join(" ")), n3["attr__" + i5.name] = No(1024, o4);
        }
      }));
      for (var a3 = 1, l3 = 1, u3 = t3; u3 = jo(u3); ) a3++, u3.tagName === t3.tagName && l3++;
      return n3.nth_child = a3, n3.nth_of_type = l3, n3;
    })(t2, o2, a2, l2));
    var r3 = (function(t3) {
      if (!Eo(t3)) return {};
      var e4 = {};
      return Xi(t3.attributes, (function(t4) {
        if (t4.name && 0 === t4.name.indexOf("data-ph-capture-attribute")) {
          var i4 = t4.name.replace("data-ph-capture-attribute-", ""), r4 = t4.value;
          i4 && r4 && Io(r4) && (e4[i4] = r4);
        }
      })), e4;
    })(t2);
    Qi(_2, r3);
  })), m2) return { props: {}, explicitNoCapture: m2 };
  if (a2 || (p2[0].$el_text = oo(e2, "a") || oo(e2, "button") ? Co(e2) : po(e2)), g2) {
    var b2, y2;
    p2[0].attr__href = g2;
    var w2 = null == (b2 = Dr(g2)) ? void 0 : b2.host, x2 = null == t || null == (y2 = t.location) ? void 0 : y2.host;
    w2 && x2 && w2 !== x2 && (v2 = g2);
  }
  return { props: Qi({ $event_type: n2.type, $ce_version: 1 }, u2 ? {} : { $elements: p2 }, { $elements_chain: (c2 = p2, (function(t2) {
    return t2.map(((t3) => {
      var e3, i3, r3 = "";
      if (t3.tag_name && (r3 += t3.tag_name), t3.attr_class) for (var s3 of (t3.attr_class.sort(), t3.attr_class)) r3 += "." + s3.replace(/"/g, "");
      var n3 = f({}, t3.text ? { text: t3.text } : {}, { "nth-child": null !== (e3 = t3.nth_child) && void 0 !== e3 ? e3 : 0, "nth-of-type": null !== (i3 = t3.nth_of_type) && void 0 !== i3 ? i3 : 0 }, t3.href ? { href: t3.href } : {}, t3.attr_id ? { attr_id: t3.attr_id } : {}, t3.attributes), o3 = {};
      return Zi(n3).sort(((t4, e4) => {
        var [i4] = t4, [r4] = e4;
        return i4.localeCompare(r4);
      })).forEach(((t4) => {
        var [e4, i4] = t4;
        return o3[Fo(e4.toString())] = Fo(i4.toString());
      })), (r3 += ":") + Zi(o3).map(((t4) => {
        var [e4, i4] = t4;
        return e4 + '="' + i4 + '"';
      })).join("");
    })).join(";");
  })((function(t2) {
    return t2.map(((t3) => {
      var e3, i3, r3 = { text: null == (e3 = t3.$el_text) ? void 0 : e3.slice(0, 400), tag_name: t3.tag_name, href: null == (i3 = t3.attr__href) ? void 0 : i3.slice(0, 2048), attr_class: Mo(t3), attr_id: t3.attr__id, nth_child: t3.nth_child, nth_of_type: t3.nth_of_type, attributes: {} };
      return Zi(t3).filter(((t4) => {
        var [e4] = t4;
        return 0 === e4.indexOf("attr__");
      })).forEach(((t4) => {
        var [e4, i4] = t4;
        return r3.attributes[e4] = i4;
      })), r3;
    }));
  })(c2))) }, null != (r2 = p2[0]) && r2.$el_text ? { $el_text: null == (s2 = p2[0]) ? void 0 : s2.$el_text } : {}, v2 && "click" === n2.type ? { $external_click_url: v2 } : {}, _2) };
}
var Bo = je("[ExceptionAutocapture]");
function Ho(t2, e2, i2) {
  try {
    if (!(e2 in t2)) return () => {
    };
    var r2 = t2[e2], s2 = i2(r2);
    return D(s2) && (s2.prototype = s2.prototype || {}, Object.defineProperties(s2, { __posthog_wrapped__: { enumerable: false, value: true } })), t2[e2] = s2, () => {
      t2[e2] = r2;
    };
  } catch (t3) {
    return () => {
    };
  }
}
var qo = je("[TracingHeaders]"), Vo = je("[Web Vitals]"), Wo = 9e5, Go = "disabled", Yo = "lazy_loading", Jo = "awaiting_config", Ko = "missing_config";
je("[SessionRecording]"), je("[SessionRecording]");
var Xo = "[SessionRecording]", Qo = je(Xo), Zo = je("[Heatmaps]");
function ta(t2) {
  return U(t2) && "clientX" in t2 && "clientY" in t2 && q(t2.clientX) && q(t2.clientY);
}
var ea = je("[Product Tours]"), ia = ["$set_once", "$set"], ra = je("[SiteApps]"), sa = "Error while initializing PostHog app with config id ";
function na(t2, e2, i2) {
  if (H(t2)) return false;
  switch (i2) {
    case "exact":
      return t2 === e2;
    case "contains":
      var r2 = e2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/_/g, ".").replace(/%/g, ".*");
      return new RegExp(r2, "i").test(t2);
    case "regex":
      try {
        return new RegExp(e2).test(t2);
      } catch (t3) {
        return false;
      }
    default:
      return false;
  }
}
class oa {
  constructor(t2) {
    this.mn = new yn(), this.yn = (t3, e2) => this.bn(t3, e2) && this._n(t3, e2) && this.wn(t3, e2) && this.xn(t3, e2), this.bn = (t3, e2) => null == e2 || !e2.event || (null == t3 ? void 0 : t3.event) === (null == e2 ? void 0 : e2.event), this._instance = t2, this.Sn = /* @__PURE__ */ new Set(), this.kn = /* @__PURE__ */ new Set();
  }
  init() {
    var t2, e2;
    N(null == (t2 = this._instance) ? void 0 : t2._addCaptureHook) || (null == (e2 = this._instance) || e2._addCaptureHook(((t3, e3) => {
      this.on(t3, e3);
    })));
  }
  register(t2) {
    var e2, i2;
    if (!N(null == (e2 = this._instance) ? void 0 : e2._addCaptureHook) && (t2.forEach(((t3) => {
      var e3, i3;
      null == (e3 = this.kn) || e3.add(t3), null == (i3 = t3.steps) || i3.forEach(((t4) => {
        var e4;
        null == (e4 = this.Sn) || e4.add((null == t4 ? void 0 : t4.event) || "");
      }));
    })), null != (i2 = this._instance) && i2.autocapture)) {
      var r2, s2 = /* @__PURE__ */ new Set();
      t2.forEach(((t3) => {
        var e3;
        null == (e3 = t3.steps) || e3.forEach(((t4) => {
          null != t4 && t4.selector && s2.add(null == t4 ? void 0 : t4.selector);
        }));
      })), null == (r2 = this._instance) || r2.autocapture.setElementSelectors(s2);
    }
  }
  on(t2, e2) {
    var i2;
    null != e2 && 0 != t2.length && (this.Sn.has(t2) || this.Sn.has(null == e2 ? void 0 : e2.event)) && this.kn && (null == (i2 = this.kn) ? void 0 : i2.size) > 0 && this.kn.forEach(((t3) => {
      this.Cn(e2, t3) && this.mn.emit("actionCaptured", t3.name);
    }));
  }
  In(t2) {
    this.onAction("actionCaptured", ((e2) => t2(e2)));
  }
  Cn(t2, e2) {
    if (null == (null == e2 ? void 0 : e2.steps)) return false;
    for (var i2 of e2.steps) if (this.yn(t2, i2)) return true;
    return false;
  }
  onAction(t2, e2) {
    return this.mn.on(t2, e2);
  }
  _n(t2, e2) {
    if (null != e2 && e2.url) {
      var i2, r2 = null == t2 || null == (i2 = t2.properties) ? void 0 : i2.$current_url;
      if (!r2 || "string" != typeof r2) return false;
      if (!na(r2, e2.url, e2.url_matching || "contains")) return false;
    }
    return true;
  }
  wn(t2, e2) {
    return !!this.Tn(t2, e2) && !!this.En(t2, e2) && !!this.Mn(t2, e2);
  }
  Tn(t2, e2) {
    var i2;
    if (null == e2 || !e2.href) return true;
    var r2 = this.Pn(t2);
    if (r2.length > 0) return r2.some(((t3) => na(t3.href, e2.href, e2.href_matching || "exact")));
    var s2, n2 = (null == t2 || null == (i2 = t2.properties) ? void 0 : i2.$elements_chain) || "";
    return !!n2 && na((s2 = n2.match(/(?::|")href="(.*?)"/)) ? s2[1] : "", e2.href, e2.href_matching || "exact");
  }
  En(t2, e2) {
    var i2;
    if (null == e2 || !e2.text) return true;
    var r2 = this.Pn(t2);
    if (r2.length > 0) return r2.some(((t3) => na(t3.text, e2.text, e2.text_matching || "exact") || na(t3.$el_text, e2.text, e2.text_matching || "exact")));
    var s2, n2, o2, a2 = (null == t2 || null == (i2 = t2.properties) ? void 0 : i2.$elements_chain) || "";
    return !!a2 && (s2 = (function(t3) {
      for (var e3, i3 = [], r3 = /(?::|")text="(.*?)"/g; !H(e3 = r3.exec(t3)); ) i3.includes(e3[1]) || i3.push(e3[1]);
      return i3;
    })(a2), n2 = e2.text, o2 = e2.text_matching || "exact", s2.some(((t3) => na(t3, n2, o2))));
  }
  Mn(t2, e2) {
    var i2, r2;
    if (null == e2 || !e2.selector) return true;
    var s2 = null == t2 || null == (i2 = t2.properties) ? void 0 : i2.$element_selectors;
    if (null != s2 && s2.includes(e2.selector)) return true;
    var n2 = (null == t2 || null == (r2 = t2.properties) ? void 0 : r2.$elements_chain) || "";
    if (e2.selector_regex && n2) try {
      return new RegExp(e2.selector_regex).test(n2);
    } catch (t3) {
      return false;
    }
    return false;
  }
  Pn(t2) {
    var e2;
    return null == (null == t2 || null == (e2 = t2.properties) ? void 0 : e2.$elements) ? [] : null == t2 ? void 0 : t2.properties.$elements;
  }
  xn(t2, e2) {
    return null == e2 || !e2.properties || 0 === e2.properties.length || Rn(e2.properties.reduce(((t3, e3) => {
      var i2 = M(e3.value) ? e3.value.map(String) : null != e3.value ? [String(e3.value)] : [];
      return t3[e3.key] = { values: i2, operator: e3.operator || "exact" }, t3;
    }), {}), null == t2 ? void 0 : t2.properties);
  }
}
class aa {
  constructor(t2) {
    this._instance = t2, this.Rn = /* @__PURE__ */ new Map(), this.On = /* @__PURE__ */ new Map(), this.Ln = /* @__PURE__ */ new Map();
  }
  Fn(t2, e2) {
    return !!t2 && Rn(t2.propertyFilters, null == e2 ? void 0 : e2.properties);
  }
  An(t2, e2) {
    var i2 = /* @__PURE__ */ new Map();
    return t2.forEach(((t3) => {
      var r2;
      null == (r2 = t3.conditions) || null == (r2 = r2[e2]) || null == (r2 = r2.values) || r2.forEach(((e3) => {
        if (null != e3 && e3.name) {
          var r3 = i2.get(e3.name) || [];
          r3.push(t3.id), i2.set(e3.name, r3);
        }
      }));
    })), i2;
  }
  Nn(t2, e2, i2) {
    var r2 = (i2 === rs.Activation ? this.Rn : this.On).get(t2), s2 = [];
    return this.$n(((t3) => {
      s2 = t3.filter(((t4) => null == r2 ? void 0 : r2.includes(t4.id)));
    })), s2.filter(((r3) => {
      var s3, n2 = null == (s3 = r3.conditions) || null == (s3 = s3[i2]) || null == (s3 = s3.values) ? void 0 : s3.find(((e3) => e3.name === t2));
      return this.Fn(n2, e2);
    }));
  }
  register(t2) {
    var e2;
    N(null == (e2 = this._instance) ? void 0 : e2._addCaptureHook) || (this.Dn(t2), this.qn(t2));
  }
  qn(t2) {
    var e2 = t2.filter(((t3) => {
      var e3, i2;
      return (null == (e3 = t3.conditions) ? void 0 : e3.actions) && (null == (i2 = t3.conditions) || null == (i2 = i2.actions) || null == (i2 = i2.values) ? void 0 : i2.length) > 0;
    }));
    0 !== e2.length && (null == this.jn && (this.jn = new oa(this._instance), this.jn.init(), this.jn.In(((t3) => {
      this.onAction(t3);
    }))), e2.forEach(((t3) => {
      var e3, i2, r2, s2, n2;
      t3.conditions && null != (e3 = t3.conditions) && e3.actions && null != (i2 = t3.conditions) && null != (i2 = i2.actions) && i2.values && (null == (r2 = t3.conditions) || null == (r2 = r2.actions) || null == (r2 = r2.values) ? void 0 : r2.length) > 0 && (null == (s2 = this.jn) || s2.register(t3.conditions.actions.values), null == (n2 = t3.conditions) || null == (n2 = n2.actions) || null == (n2 = n2.values) || n2.forEach(((e4) => {
        if (e4 && e4.name) {
          var i3 = this.Ln.get(e4.name);
          i3 && i3.push(t3.id), this.Ln.set(e4.name, i3 || [t3.id]);
        }
      })));
    })));
  }
  Dn(t2) {
    var e2, i2 = t2.filter(((t3) => {
      var e3, i3;
      return (null == (e3 = t3.conditions) ? void 0 : e3.events) && (null == (i3 = t3.conditions) || null == (i3 = i3.events) || null == (i3 = i3.values) ? void 0 : i3.length) > 0;
    })), r2 = t2.filter(((t3) => {
      var e3, i3;
      return (null == (e3 = t3.conditions) ? void 0 : e3.cancelEvents) && (null == (i3 = t3.conditions) || null == (i3 = i3.cancelEvents) || null == (i3 = i3.values) ? void 0 : i3.length) > 0;
    }));
    0 === i2.length && 0 === r2.length || (null == (e2 = this._instance) || e2._addCaptureHook(((t3, e3) => {
      this.onEvent(t3, e3);
    })), this.Rn = this.An(t2, rs.Activation), this.On = this.An(t2, rs.Cancellation));
  }
  onEvent(t2, e2) {
    var i2, r2 = this.le(), s2 = this.Hn(), n2 = this.Un(), o2 = (null == (i2 = this._instance) || null == (i2 = i2.persistence) ? void 0 : i2.props[s2]) || [];
    if (n2 === t2 && e2 && o2.length > 0) {
      var a2, l2;
      r2.info("event matched, removing item from activated items", { event: t2, eventPayload: e2, existingActivatedItems: o2 });
      var u2 = (null == e2 || null == (a2 = e2.properties) ? void 0 : a2.$survey_id) || (null == e2 || null == (l2 = e2.properties) ? void 0 : l2.$product_tour_id);
      if (u2) {
        var h2 = o2.indexOf(u2);
        0 > h2 || (o2.splice(h2, 1), this.Bn(o2));
      }
    } else {
      if (this.On.has(t2)) {
        var d2 = this.Nn(t2, e2, rs.Cancellation);
        d2.length > 0 && (r2.info("cancel event matched, cancelling items", { event: t2, itemsToCancel: d2.map(((t3) => t3.id)) }), d2.forEach(((t3) => {
          var e3 = o2.indexOf(t3.id);
          0 > e3 || o2.splice(e3, 1), this.zn(t3.id);
        })), this.Bn(o2));
      }
      if (this.Rn.has(t2)) {
        r2.info("event name matched", { event: t2, eventPayload: e2, items: this.Rn.get(t2) });
        var v2 = this.Nn(t2, e2, rs.Activation);
        this.Bn(o2.concat(v2.map(((t3) => t3.id)) || []));
      }
    }
  }
  onAction(t2) {
    var e2, i2 = this.Hn(), r2 = (null == (e2 = this._instance) || null == (e2 = e2.persistence) ? void 0 : e2.props[i2]) || [];
    this.Ln.has(t2) && this.Bn(r2.concat(this.Ln.get(t2) || []));
  }
  Bn(t2) {
    var e2 = this.le(), i2 = [...new Set(t2)].filter(((t3) => !this.Vn(t3)));
    e2.info("updating activated items", { activatedItems: i2 }), this.Wn(i2);
  }
  getActivatedIds() {
    var t2, e2 = this.Hn();
    return (null == (t2 = this._instance) || null == (t2 = t2.persistence) ? void 0 : t2.props[e2]) || [];
  }
  getEventToItemsMap() {
    return this.Rn;
  }
  Zn() {
    return this.jn;
  }
}
class la extends aa {
  constructor(t2) {
    super(t2);
  }
  Hn() {
    return yi;
  }
  Un() {
    return ds.SHOWN;
  }
  $n(t2) {
    var e2;
    null == (e2 = this._instance) || e2.getSurveys(t2);
  }
  zn(t2) {
    var e2;
    null == (e2 = this._instance) || e2.cancelPendingSurvey(t2);
  }
  le() {
    return An;
  }
  Wn(t2) {
    var e2;
    null == (e2 = this._instance) || null == (e2 = e2.persistence) || e2.register({ [yi]: t2 });
  }
  Vn() {
    return false;
  }
  getSurveys() {
    return this.getActivatedIds();
  }
  getEventToSurveys() {
    return this.getEventToItemsMap();
  }
}
var ua = "SDK is not enabled or survey functionality is not yet loaded", ha = "Disabled. Not loading surveys.", da = null != t && t.location ? Nr(t.location.hash, "__posthog") || Nr(location.hash, "state") : null, va = "_postHogToolbarParams", ca = je("[Toolbar]"), pa = je("[FeatureFlags]"), fa = je("[FeatureFlags]", { debugEnabled: true }), _a = `" failed. Feature flags didn't load in time.`, ga = (t2) => {
  for (var e2 = {}, i2 = 0; t2.length > i2; i2++) e2[t2[i2]] = true;
  return e2;
}, ma = (t2) => {
  var e2 = {};
  for (var [i2, r2] of Zi(t2 || {})) r2 && (e2[i2] = r2);
  return e2;
}, ba = je("[Error tracking]"), ya = "Refusing to render web experiment since the viewer is a likely bot", wa = { icontains: (e2, i2) => !!t && i2.href.toLowerCase().indexOf(e2.toLowerCase()) > -1, not_icontains: (e2, i2) => !!t && -1 === i2.href.toLowerCase().indexOf(e2.toLowerCase()), regex: (e2, i2) => !!t && Sn(i2.href, e2), not_regex: (e2, i2) => !!t && !Sn(i2.href, e2), exact: (t2, e2) => e2.href === t2, is_not: (t2, e2) => e2.href !== t2 };
class xa {
  get qt() {
    return this._instance.config;
  }
  constructor(t2) {
    var e2 = this;
    this.getWebExperimentsAndEvaluateDisplayLogic = function(t3) {
      void 0 === t3 && (t3 = false), e2.getWebExperiments(((t4) => {
        xa.Gn("retrieved web experiments from the server"), e2.Qn = /* @__PURE__ */ new Map(), t4.forEach(((t5) => {
          if (t5.feature_flag_key) {
            var i2;
            e2.Qn && (xa.Gn("setting flag key ", t5.feature_flag_key, " to web experiment ", t5), null == (i2 = e2.Qn) || i2.set(t5.feature_flag_key, t5));
            var r2 = e2._instance.getFeatureFlag(t5.feature_flag_key);
            j(r2) && t5.variants[r2] && e2.Jn(t5.name, r2, t5.variants[r2].transforms);
          } else if (t5.variants) for (var s2 in t5.variants) {
            var n2 = t5.variants[s2];
            xa.Kn(n2) && e2.Jn(t5.name, s2, n2.transforms);
          }
        }));
      }), t3);
    }, this._instance = t2, this._instance.onFeatureFlags(((t3) => {
      this.onFeatureFlags(t3);
    }));
  }
  initialize() {
  }
  onFeatureFlags(t2) {
    if (this._is_bot()) xa.Gn(ya);
    else if (!this.qt.disable_web_experiments) {
      if (H(this.Qn)) return this.Qn = /* @__PURE__ */ new Map(), this.loadIfEnabled(), void this.previewWebExperiment();
      xa.Gn("applying feature flags", t2), t2.forEach(((t3) => {
        var e2;
        if (this.Qn && null != (e2 = this.Qn) && e2.has(t3)) {
          var i2, r2 = this._instance.getFeatureFlag(t3), s2 = null == (i2 = this.Qn) ? void 0 : i2.get(t3);
          r2 && null != s2 && s2.variants[r2] && this.Jn(s2.name, r2, s2.variants[r2].transforms);
        }
      }));
    }
  }
  previewWebExperiment() {
    var t2 = xa.getWindowLocation();
    if (null != t2 && t2.search) {
      var e2 = Ur(null == t2 ? void 0 : t2.search, "__experiment_id"), i2 = Ur(null == t2 ? void 0 : t2.search, "__experiment_variant");
      e2 && i2 && (xa.Gn("previewing web experiments " + e2 + " && " + i2), this.getWebExperiments(((t3) => {
        this.Yn(parseInt(e2), i2, t3);
      }), false, true));
    }
  }
  loadIfEnabled() {
    this.qt.disable_web_experiments || this.getWebExperimentsAndEvaluateDisplayLogic();
  }
  getWebExperiments(t2, e2, i2) {
    if (this.qt.disable_web_experiments && !i2) return t2([]);
    var r2 = this._instance.get_property("$web_experiments");
    if (r2 && !e2) return t2(r2);
    this._instance._send_request({ url: this._instance.requestRouter.endpointFor("api", "/api/web_experiments/?token=" + this.qt.token), method: "GET", callback: (e3) => t2(200 === e3.statusCode && e3.json && e3.json.experiments || []) });
  }
  Yn(t2, e2, i2) {
    var r2 = i2.filter(((e3) => e3.id === t2));
    r2 && r2.length > 0 && (xa.Gn("Previewing web experiment [" + r2[0].name + "] with variant [" + e2 + "]"), this.Jn(r2[0].name, e2, r2[0].variants[e2].transforms));
  }
  static Kn(t2) {
    return !H(t2.conditions) && xa.Xn(t2) && xa.ts(t2);
  }
  static Xn(t2) {
    var e2;
    if (H(t2.conditions) || H(null == (e2 = t2.conditions) ? void 0 : e2.url)) return true;
    var i2, r2, s2, n2 = xa.getWindowLocation();
    return !!n2 && (null == (i2 = t2.conditions) || !i2.url || wa[null !== (r2 = null == (s2 = t2.conditions) ? void 0 : s2.urlMatchType) && void 0 !== r2 ? r2 : "icontains"](t2.conditions.url, n2));
  }
  static getWindowLocation() {
    return null == t ? void 0 : t.location;
  }
  static ts(t2) {
    var e2;
    if (H(t2.conditions) || H(null == (e2 = t2.conditions) ? void 0 : e2.utm)) return true;
    var i2 = Vr();
    if (i2.utm_source) {
      var r2, s2, n2, o2, a2, l2, u2, h2, d2 = null == (r2 = t2.conditions) || null == (r2 = r2.utm) || !r2.utm_campaign || (null == (s2 = t2.conditions) || null == (s2 = s2.utm) ? void 0 : s2.utm_campaign) == i2.utm_campaign, v2 = null == (n2 = t2.conditions) || null == (n2 = n2.utm) || !n2.utm_source || (null == (o2 = t2.conditions) || null == (o2 = o2.utm) ? void 0 : o2.utm_source) == i2.utm_source, c2 = null == (a2 = t2.conditions) || null == (a2 = a2.utm) || !a2.utm_medium || (null == (l2 = t2.conditions) || null == (l2 = l2.utm) ? void 0 : l2.utm_medium) == i2.utm_medium, p2 = null == (u2 = t2.conditions) || null == (u2 = u2.utm) || !u2.utm_term || (null == (h2 = t2.conditions) || null == (h2 = h2.utm) ? void 0 : h2.utm_term) == i2.utm_term;
      return d2 && c2 && p2 && v2;
    }
    return false;
  }
  static Gn(t2) {
    for (var e2 = arguments.length, i2 = new Array(e2 > 1 ? e2 - 1 : 0), r2 = 1; e2 > r2; r2++) i2[r2 - 1] = arguments[r2];
    Ne.info("[WebExperiments] " + t2, i2);
  }
  Jn(t2, e2, i2) {
    this._is_bot() ? xa.Gn(ya) : "control" !== e2 ? i2.forEach(((i3) => {
      if (i3.selector) {
        var r2;
        xa.Gn("applying transform of variant " + e2 + " for experiment " + t2 + " ", i3);
        var s2 = null == (r2 = document) ? void 0 : r2.querySelectorAll(i3.selector);
        null == s2 || s2.forEach(((t3) => {
          var e3 = t3;
          i3.html && (e3.innerHTML = i3.html), i3.css && e3.setAttribute("style", i3.css);
        }));
      }
    })) : xa.Gn("Control variants leave the page unmodified.");
  }
  _is_bot() {
    return i && this._instance ? En(i, this.qt.custom_blocked_useragents) : void 0;
  }
}
var Ea = je("[Conversations]"), Sa = "Conversations not available yet.", $a = { featureFlags: class {
  constructor(t2) {
    this.es = false, this.rs = false, this.ns = false, this.ss = false, this.os = false, this.us = false, this.ls = false, this.hs = false, this._instance = t2, this.featureFlagEventHandlers = [];
  }
  get qt() {
    return this._instance.config;
  }
  get ni() {
    return this._instance.persistence;
  }
  cs(t2) {
    return this._instance.get_property(t2);
  }
  ds() {
    var t2, e2;
    return null !== (t2 = null == (e2 = this.ni) ? void 0 : e2.wr(this.qt.feature_flag_cache_ttl_ms)) && void 0 !== t2 && t2;
  }
  vs() {
    return !!this.ds() && (this.hs || this.ns || (this.hs = true, pa.warn("Feature flag cache is stale, triggering refresh..."), this.reloadFeatureFlags()), true);
  }
  fs() {
    var t2, e2 = null !== (t2 = this.qt.evaluation_contexts) && void 0 !== t2 ? t2 : this.qt.evaluation_environments;
    return !this.qt.evaluation_environments || this.qt.evaluation_contexts || this.ls || (pa.warn("evaluation_environments is deprecated. Use evaluation_contexts instead. evaluation_environments will be removed in a future version."), this.ls = true), null != e2 && e2.length ? e2.filter(((t3) => {
      var e3 = t3 && "string" == typeof t3 && t3.trim().length > 0;
      return e3 || pa.error("Invalid evaluation context found:", t3, "Expected non-empty string"), e3;
    })) : [];
  }
  ps() {
    return this.fs().length > 0;
  }
  gs() {
    var t2 = this.qt.flag_keys;
    if (!N(t2)) {
      if (M(t2)) return t2.filter(((t3) => {
        var e2 = t3 && "string" == typeof t3 && t3.trim().length > 0;
        return e2 || pa.error("Invalid flag key found:", t3, "Expected non-empty string"), e2;
      }));
      pa.error("Invalid flag_keys found:", t2, "Expected array of non-empty strings");
    }
  }
  initialize() {
    var t2, e2, { config: i2 } = this._instance, r2 = null !== (t2 = null == (e2 = i2.bootstrap) ? void 0 : e2.featureFlags) && void 0 !== t2 ? t2 : {};
    if (Object.keys(r2).length) {
      var s2, n2, o2 = null !== (s2 = null == (n2 = i2.bootstrap) ? void 0 : n2.featureFlagPayloads) && void 0 !== s2 ? s2 : {}, a2 = Object.keys(r2).filter(((t3) => !!r2[t3])).reduce(((t3, e3) => (t3[e3] = r2[e3] || false, t3)), {}), l2 = Object.keys(o2).filter(((t3) => a2[t3])).reduce(((t3, e3) => (o2[e3] && (t3[e3] = o2[e3]), t3)), {});
      this.receivedFeatureFlags({ featureFlags: a2, featureFlagPayloads: l2 });
    }
  }
  updateFlags(t2, e2, i2) {
    var r2 = null != i2 && i2.merge ? this.getFlagVariants() : {}, s2 = null != i2 && i2.merge ? this.getFlagPayloads() : {}, n2 = f({}, r2, t2), o2 = f({}, s2, e2), a2 = {};
    for (var [l2, u2] of Object.entries(n2)) {
      var h2 = "string" == typeof u2;
      a2[l2] = { key: l2, enabled: !!h2 || Boolean(u2), variant: h2 ? u2 : void 0, reason: void 0, metadata: N(null == o2 ? void 0 : o2[l2]) ? void 0 : { id: 0, version: void 0, description: void 0, payload: o2[l2] } };
    }
    this.receivedFeatureFlags({ flags: a2 });
  }
  get hasLoadedFlags() {
    return this.rs;
  }
  getFlags() {
    return Object.keys(this.getFlagVariants());
  }
  getFlagsWithDetails() {
    var t2 = this.cs(vi), e2 = this.cs(fi), i2 = this.cs(_i);
    if (!i2 && !e2) return t2 || {};
    var r2 = Qi({}, t2 || {}), s2 = [.../* @__PURE__ */ new Set([...Object.keys(i2 || {}), ...Object.keys(e2 || {})])];
    for (var n2 of s2) {
      var o2, a2, l2 = r2[n2], u2 = null == e2 ? void 0 : e2[n2], h2 = N(u2) ? null !== (o2 = null == l2 ? void 0 : l2.enabled) && void 0 !== o2 && o2 : !!u2, d2 = N(u2) ? l2.variant : "string" == typeof u2 ? u2 : void 0, v2 = null == i2 ? void 0 : i2[n2], c2 = f({}, l2, { enabled: h2, variant: h2 ? null != d2 ? d2 : null == l2 ? void 0 : l2.variant : void 0 });
      h2 !== (null == l2 ? void 0 : l2.enabled) && (c2.original_enabled = null == l2 ? void 0 : l2.enabled), d2 !== (null == l2 ? void 0 : l2.variant) && (c2.original_variant = null == l2 ? void 0 : l2.variant), v2 && (c2.metadata = f({}, null == l2 ? void 0 : l2.metadata, { payload: v2, original_payload: null == l2 || null == (a2 = l2.metadata) ? void 0 : a2.payload })), r2[n2] = c2;
    }
    return this.es || (pa.warn(" Overriding feature flag details!", { flagDetails: t2, overriddenPayloads: i2, finalDetails: r2 }), this.es = true), r2;
  }
  getFlagVariants() {
    var t2 = this.cs(ui), e2 = this.cs(fi);
    if (!e2) return t2 || {};
    for (var i2 = Qi({}, t2), r2 = Object.keys(e2), s2 = 0; r2.length > s2; s2++) i2[r2[s2]] = e2[r2[s2]];
    return this.es || (pa.warn(" Overriding feature flags!", { enabledFlags: t2, overriddenFlags: e2, finalFlags: i2 }), this.es = true), i2;
  }
  getFlagPayloads() {
    var t2 = this.cs(ci), e2 = this.cs(_i);
    if (!e2) return t2 || {};
    for (var i2 = Qi({}, t2 || {}), r2 = Object.keys(e2), s2 = 0; r2.length > s2; s2++) i2[r2[s2]] = e2[r2[s2]];
    return this.es || (pa.warn(" Overriding feature flag payloads!", { flagPayloads: t2, overriddenPayloads: e2, finalPayloads: i2 }), this.es = true), i2;
  }
  reloadFeatureFlags() {
    this.ss || this.qt.advanced_disable_feature_flags || this.ys || (this._instance.$i.emit("featureFlagsReloading", true), this.ys = setTimeout((() => {
      this.bs();
    }), 5));
  }
  _s() {
    clearTimeout(this.ys), this.ys = void 0;
  }
  ensureFlagsLoaded() {
    this.rs || this.ns || this.ys || this.reloadFeatureFlags();
  }
  setAnonymousDistinctId(t2) {
    this.$anon_distinct_id = t2;
  }
  setReloadingPaused(t2) {
    this.ss = t2;
  }
  bs(t2) {
    var e2;
    if (this._s(), !this._instance.Lr()) if (this.ns) this.os = true;
    else {
      var i2 = this.qt.token, r2 = this.cs(qe), s2 = { token: i2, distinct_id: this._instance.get_distinct_id(), groups: this._instance.getGroups(), $anon_distinct_id: this.$anon_distinct_id, person_properties: f({}, (null == (e2 = this.ni) ? void 0 : e2.get_initial_props()) || {}, this.cs(gi) || {}), group_properties: this.cs(mi), timezone: Zr() };
      B(r2) || N(r2) || (s2.$device_id = r2), (null != t2 && t2.disableFlags || this.qt.advanced_disable_feature_flags) && (s2.disable_flags = true), this.ps() && (s2.evaluation_contexts = this.fs());
      var n2 = this.gs();
      N(n2) || (s2.flag_keys = n2);
      var o2 = !!this.qt.advanced_only_evaluate_survey_feature_flags, a2 = this._instance.requestRouter.endpointFor("flags", "/flags/?v=2" + (this.qt.advanced_only_evaluate_survey_feature_flags ? "&only_evaluate_survey_feature_flags=true" : ""));
      this.ns = true, this._instance._send_request({ method: "POST", url: a2, data: s2, compression: this.qt.disable_compression ? void 0 : xs.Base64, timeout: this.qt.feature_flag_request_timeout_ms, callback: (t3) => {
        var e3, i3, r3, n3 = true;
        if (200 === t3.statusCode && (this.os || (this.$anon_distinct_id = void 0), n3 = false), this.ns = false, !s2.disable_flags || this.os) {
          this.us = !n3;
          var a3 = [];
          t3.error ? t3.error instanceof Error ? a3.push("AbortError" === t3.error.name ? "timeout" : "connection_error") : a3.push("unknown_error") : 200 !== t3.statusCode && a3.push("api_error_" + t3.statusCode), null != (e3 = t3.json) && e3.errorsWhileComputingFlags && a3.push("errors_while_computing_flags");
          var l2, u2 = !(null == (i3 = t3.json) || null == (i3 = i3.quotaLimited) || !i3.includes("feature_flags"));
          if (u2 && a3.push("quota_limited"), null == (r3 = this.ni) || r3.register({ [Si]: a3 }), u2) pa.warn("You have hit your feature flags quota limit, and will not be able to load feature flags until the quota is reset.  Please visit https://posthog.com/docs/billing/limits-alerts to learn more.");
          else s2.disable_flags || this.receivedFeatureFlags(null !== (l2 = t3.json) && void 0 !== l2 ? l2 : {}, n3, { partialResponse: o2 }), this.os && (this.os = false, this.bs());
        }
      } });
    }
  }
  getFeatureFlag(t2, e2) {
    var i2;
    if (void 0 === e2 && (e2 = {}), !e2.fresh || this.us) if (this.rs || this.getFlags() && this.getFlags().length > 0) {
      if (!this.vs()) {
        var r2 = this.getFeatureFlagResult(t2, e2);
        return null !== (i2 = null == r2 ? void 0 : r2.variant) && void 0 !== i2 ? i2 : null == r2 ? void 0 : r2.enabled;
      }
    } else pa.warn('getFeatureFlag for key "' + t2 + _a);
  }
  getFeatureFlagDetails(t2) {
    return this.getFlagsWithDetails()[t2];
  }
  getFeatureFlagPayload(t2) {
    var e2 = this.getFeatureFlagResult(t2, { send_event: false });
    return null == e2 ? void 0 : e2.payload;
  }
  getFeatureFlagResult(t2, e2) {
    if (void 0 === e2 && (e2 = {}), !e2.fresh || this.us) if (this.rs || this.getFlags() && this.getFlags().length > 0) {
      if (!this.vs()) {
        var i2 = this.getFlagVariants(), r2 = t2 in i2, s2 = i2[t2], n2 = this.getFlagPayloads()[t2], o2 = String(s2), a2 = this.cs(pi) || void 0, l2 = this.cs($i) || void 0, u2 = this.cs(xi) || {};
        if (this.qt.advanced_feature_flags_dedup_per_session) {
          var h2, d2 = this._instance.get_session_id(), v2 = this.cs(Ei);
          d2 && d2 !== v2 && (u2 = {}, null == (h2 = this.ni) || h2.register({ [xi]: u2, [Ei]: d2 }));
        }
        if ((e2.send_event || !("send_event" in e2)) && (!(t2 in u2) || !u2[t2].includes(o2))) {
          var c2, p2, f2, _2, g2, m2, b2, y2, w2, x2;
          M(u2[t2]) ? u2[t2].push(o2) : u2[t2] = [o2], null == (c2 = this.ni) || c2.register({ [xi]: u2 });
          var E2 = this.getFeatureFlagDetails(t2), S2 = [...null !== (p2 = this.cs(Si)) && void 0 !== p2 ? p2 : []];
          N(s2) && S2.push("flag_missing");
          var T2 = { $feature_flag: t2, $feature_flag_response: s2, $feature_flag_payload: n2 || null, $feature_flag_request_id: a2, $feature_flag_evaluated_at: l2, $feature_flag_bootstrapped_response: (null == (f2 = this.qt.bootstrap) || null == (f2 = f2.featureFlags) ? void 0 : f2[t2]) || null, $feature_flag_bootstrapped_payload: (null == (_2 = this.qt.bootstrap) || null == (_2 = _2.featureFlagPayloads) ? void 0 : _2[t2]) || null, $used_bootstrap_value: !this.us };
          N(null == E2 || null == (g2 = E2.metadata) ? void 0 : g2.version) || (T2.$feature_flag_version = E2.metadata.version);
          var k2, R2 = null !== (m2 = null == E2 || null == (b2 = E2.reason) ? void 0 : b2.description) && void 0 !== m2 ? m2 : null == E2 || null == (y2 = E2.reason) ? void 0 : y2.code;
          R2 && (T2.$feature_flag_reason = R2), null != E2 && null != (w2 = E2.metadata) && w2.id && (T2.$feature_flag_id = E2.metadata.id), N(null == E2 ? void 0 : E2.original_variant) && N(null == E2 ? void 0 : E2.original_enabled) || (T2.$feature_flag_original_response = N(E2.original_variant) ? E2.original_enabled : E2.original_variant), null != E2 && null != (x2 = E2.metadata) && x2.original_payload && (T2.$feature_flag_original_payload = null == E2 || null == (k2 = E2.metadata) ? void 0 : k2.original_payload), S2.length && (T2.$feature_flag_error = S2.join(",")), this._instance.capture("$feature_flag_called", T2);
        }
        if (r2) {
          var P2 = n2;
          if (!N(n2)) try {
            P2 = JSON.parse(n2);
          } catch (t3) {
          }
          return { key: t2, enabled: !!s2, variant: "string" == typeof s2 ? s2 : void 0, payload: P2 };
        }
      }
    } else pa.warn('getFeatureFlagResult for key "' + t2 + _a);
  }
  getRemoteConfigPayload(t2, e2) {
    var i2 = this.qt.token, r2 = { distinct_id: this._instance.get_distinct_id(), token: i2 };
    this.ps() && (r2.evaluation_contexts = this.fs());
    var s2 = this.gs();
    N(s2) || (r2.flag_keys = s2), this._instance._send_request({ method: "POST", url: this._instance.requestRouter.endpointFor("flags", "/flags/?v=2"), data: r2, compression: this.qt.disable_compression ? void 0 : xs.Base64, timeout: this.qt.feature_flag_request_timeout_ms, callback(i3) {
      var r3, s3 = null == (r3 = i3.json) ? void 0 : r3.featureFlagPayloads;
      e2((null == s3 ? void 0 : s3[t2]) || void 0);
    } });
  }
  isFeatureEnabled(t2, e2) {
    if (void 0 === e2 && (e2 = {}), !e2.fresh || this.us) {
      if (this.rs || this.getFlags() && this.getFlags().length > 0) {
        var i2 = this.getFeatureFlag(t2, e2);
        return N(i2) ? void 0 : !!i2;
      }
      pa.warn('isFeatureEnabled for key "' + t2 + _a);
    }
  }
  addFeatureFlagsHandler(t2) {
    this.featureFlagEventHandlers.push(t2);
  }
  removeFeatureFlagsHandler(t2) {
    this.featureFlagEventHandlers = this.featureFlagEventHandlers.filter(((e2) => e2 !== t2));
  }
  receivedFeatureFlags(t2, e2, i2) {
    if (this.ni) {
      this.rs = true;
      var r2 = this.getFlagVariants(), s2 = this.getFlagPayloads(), n2 = this.getFlagsWithDetails();
      !(function(t3, e3, i3, r3, s3, n3) {
        void 0 === i3 && (i3 = {}), void 0 === r3 && (r3 = {}), void 0 === s3 && (s3 = {});
        var o2 = ((t4) => {
          var e4 = t4.flags;
          return e4 ? (t4.featureFlags = Object.fromEntries(Object.keys(e4).map(((t5) => {
            var i4;
            return [t5, null !== (i4 = e4[t5].variant) && void 0 !== i4 ? i4 : e4[t5].enabled];
          }))), t4.featureFlagPayloads = Object.fromEntries(Object.keys(e4).filter(((t5) => e4[t5].enabled)).filter(((t5) => {
            var i4;
            return null == (i4 = e4[t5].metadata) ? void 0 : i4.payload;
          })).map(((t5) => {
            var i4;
            return [t5, null == (i4 = e4[t5].metadata) ? void 0 : i4.payload];
          })))) : pa.warn("Using an older version of the feature flags endpoint. Please upgrade your PostHog server to the latest version"), t4;
        })(t3), a2 = o2.flags, l2 = o2.featureFlags, u2 = o2.featureFlagPayloads;
        if (l2) {
          var h2 = t3.requestId, d2 = t3.evaluatedAt;
          if (M(l2)) {
            pa.warn("v1 of the feature flags endpoint is deprecated. Please use the latest version.");
            var v2 = {};
            if (l2) for (var c2 = 0; l2.length > c2; c2++) v2[l2[c2]] = true;
            e3 && e3.register({ [hi]: l2, [ui]: v2 });
          } else {
            var p2 = l2, _2 = u2, g2 = a2;
            if (null != n3 && n3.partialResponse) p2 = f({}, i3, p2), _2 = f({}, r3, _2), g2 = f({}, s3, g2);
            else if (t3.errorsWhileComputingFlags) if (a2) {
              var m2 = new Set(Object.keys(a2).filter(((t4) => {
                var e4;
                return !(null != (e4 = a2[t4]) && e4.failed);
              })));
              p2 = f({}, i3, Object.fromEntries(Object.entries(p2).filter(((t4) => {
                var [e4] = t4;
                return m2.has(e4);
              })))), _2 = f({}, r3, Object.fromEntries(Object.entries(_2 || {}).filter(((t4) => {
                var [e4] = t4;
                return m2.has(e4);
              })))), g2 = f({}, s3, Object.fromEntries(Object.entries(g2 || {}).filter(((t4) => {
                var [e4] = t4;
                return m2.has(e4);
              }))));
            } else p2 = f({}, i3, p2), _2 = f({}, r3, _2), g2 = f({}, s3, g2);
            e3 && e3.register(f({ [hi]: Object.keys(ma(p2)), [ui]: p2 || {}, [ci]: _2 || {}, [vi]: g2 || {} }, h2 ? { [pi]: h2 } : {}, d2 ? { [$i]: d2 } : {}));
          }
        }
      })(t2, this.ni, r2, s2, n2, i2), e2 || (this.hs = false), this.ws(e2);
    }
  }
  override(t2, e2) {
    void 0 === e2 && (e2 = false), pa.warn("override is deprecated. Please use overrideFeatureFlags instead."), this.overrideFeatureFlags({ flags: t2, suppressWarning: e2 });
  }
  overrideFeatureFlags(t2) {
    if (!this._instance.__loaded || !this.ni) return pa.uninitializedWarning("posthog.featureFlags.overrideFeatureFlags");
    if (false === t2) return this.ni.unregister(fi), this.ni.unregister(_i), this.ws(), fa.info("All overrides cleared");
    if (M(t2)) {
      var e2 = ga(t2);
      return this.ni.register({ [fi]: e2 }), this.ws(), fa.info("Flag overrides set", { flags: t2 });
    }
    if (t2 && "object" == typeof t2 && ("flags" in t2 || "payloads" in t2)) {
      var i2, r2 = t2;
      if (this.es = Boolean(null !== (i2 = r2.suppressWarning) && void 0 !== i2 && i2), "flags" in r2) {
        if (false === r2.flags) this.ni.unregister(fi), fa.info("Flag overrides cleared");
        else if (r2.flags) {
          if (M(r2.flags)) {
            var s2 = ga(r2.flags);
            this.ni.register({ [fi]: s2 });
          } else this.ni.register({ [fi]: r2.flags });
          fa.info("Flag overrides set", { flags: r2.flags });
        }
      }
      return "payloads" in r2 && (false === r2.payloads ? (this.ni.unregister(_i), fa.info("Payload overrides cleared")) : r2.payloads && (this.ni.register({ [_i]: r2.payloads }), fa.info("Payload overrides set", { payloads: r2.payloads }))), void this.ws();
    }
    if (t2 && "object" == typeof t2) return this.ni.register({ [fi]: t2 }), this.ws(), fa.info("Flag overrides set", { flags: t2 });
    pa.warn("Invalid overrideOptions provided to overrideFeatureFlags", { overrideOptions: t2 });
  }
  onFeatureFlags(t2) {
    if (this.addFeatureFlagsHandler(t2), this.rs) {
      var { flags: e2, flagVariants: i2 } = this.xs();
      t2(e2, i2);
    }
    return () => this.removeFeatureFlagsHandler(t2);
  }
  updateEarlyAccessFeatureEnrollment(t2, e2, i2) {
    var r2, s2 = (this.cs(di) || []).find(((e3) => e3.flagKey === t2)), n2 = { ["$feature_enrollment/" + t2]: e2 }, o2 = { $feature_flag: t2, $feature_enrollment: e2, $set: n2 };
    s2 && (o2.$early_access_feature_name = s2.name), i2 && (o2.$feature_enrollment_stage = i2), this._instance.capture("$feature_enrollment_update", o2), this.setPersonPropertiesForFlags(n2, false);
    var a2 = f({}, this.getFlagVariants(), { [t2]: e2 });
    null == (r2 = this.ni) || r2.register({ [hi]: Object.keys(ma(a2)), [ui]: a2 }), this.ws();
  }
  getEarlyAccessFeatures(t2, e2, i2) {
    void 0 === e2 && (e2 = false);
    var r2 = this.cs(di), s2 = i2 ? "&" + i2.map(((t3) => "stage=" + t3)).join("&") : "";
    if (r2 && !e2) return t2(r2);
    this._instance._send_request({ url: this._instance.requestRouter.endpointFor("api", "/api/early_access_features/?token=" + this.qt.token + s2), method: "GET", callback: (e3) => {
      var i3, r3;
      if (e3.json) {
        var s3 = e3.json.earlyAccessFeatures;
        return null == (i3 = this.ni) || i3.unregister(di), null == (r3 = this.ni) || r3.register({ [di]: s3 }), t2(s3);
      }
    } });
  }
  xs() {
    var t2 = this.getFlags(), e2 = this.getFlagVariants();
    return { flags: t2.filter(((t3) => e2[t3])), flagVariants: Object.keys(e2).filter(((t3) => e2[t3])).reduce(((t3, i2) => (t3[i2] = e2[i2], t3)), {}) };
  }
  ws(t2) {
    var { flags: e2, flagVariants: i2 } = this.xs();
    this.featureFlagEventHandlers.forEach(((r2) => r2(e2, i2, { errorsLoading: t2 })));
  }
  setPersonPropertiesForFlags(t2, e2) {
    void 0 === e2 && (e2 = true);
    var i2 = this.cs(gi) || {}, r2 = (null == t2 ? void 0 : t2.$set) || (null != t2 && t2.$set_once ? {} : t2), s2 = null == t2 ? void 0 : t2.$set_once, n2 = {};
    if (s2) for (var o2 in s2) ({}).hasOwnProperty.call(s2, o2) && (o2 in i2 || (n2[o2] = s2[o2]));
    this._instance.register({ [gi]: f({}, i2, n2, r2) }), e2 && this._instance.reloadFeatureFlags();
  }
  resetPersonPropertiesForFlags() {
    this._instance.unregister(gi);
  }
  setGroupPropertiesForFlags(t2, e2) {
    void 0 === e2 && (e2 = true);
    var i2 = this.cs(mi) || {};
    0 !== Object.keys(i2).length && Object.keys(i2).forEach(((e3) => {
      i2[e3] = f({}, i2[e3], t2[e3]), delete t2[e3];
    })), this._instance.register({ [mi]: f({}, i2, t2) }), e2 && this._instance.reloadFeatureFlags();
  }
  resetGroupPropertiesForFlags(t2) {
    if (t2) {
      var e2 = this.cs(mi) || {};
      this._instance.register({ [mi]: f({}, e2, { [t2]: {} }) });
    } else this._instance.unregister(mi);
  }
  reset() {
    this.rs = false, this.ns = false, this.ss = false, this.os = false, this.us = false, this.$anon_distinct_id = void 0, this._s(), this.es = false;
  }
} }, Ta = { sessionRecording: class {
  get qt() {
    return this._instance.config;
  }
  get ni() {
    return this._instance.persistence;
  }
  get started() {
    var t2;
    return !(null == (t2 = this.Ss) || !t2.isStarted);
  }
  get status() {
    var t2, e2;
    return this.ks === Jo || this.ks === Ko ? this.ks : null !== (t2 = null == (e2 = this.Ss) ? void 0 : e2.status) && void 0 !== t2 ? t2 : this.ks;
  }
  constructor(t2) {
    if (this._forceAllowLocalhostNetworkCapture = false, this.ks = Go, this.Cs = void 0, this._instance = t2, !this._instance.sessionManager) throw Qo.error("started without valid sessionManager"), new Error(Xo + " started without valid sessionManager. This is a bug.");
    if (this.qt.cookieless_mode === ji) throw new Error(Xo + ' cannot be used with cookieless_mode="always"');
  }
  initialize() {
    this.startIfEnabledOrStop();
  }
  get Is() {
    var e2, i2 = !(null == (e2 = this._instance.get_property(ii)) || !e2.enabled), r2 = !this.qt.disable_session_recording, s2 = this.qt.disable_session_recording || this._instance.consent.isOptedOut();
    return t && i2 && r2 && !s2;
  }
  startIfEnabledOrStop(t2) {
    var e2;
    if (!this.Is || null == (e2 = this.Ss) || !e2.isStarted) {
      var i2 = !N(Object.assign) && !N(Array.from);
      this.Is && i2 ? (this.Ts(t2), Qo.info("starting")) : (this.ks = Go, this.stopRecording());
    }
  }
  Ts(t2) {
    var e2, i2, r2;
    this.Is && (this.ks !== Jo && this.ks !== Ko && (this.ks = Yo), null != h && null != (e2 = h.__PosthogExtensions__) && null != (e2 = e2.rrweb) && e2.record && null != (i2 = h.__PosthogExtensions__) && i2.initSessionRecording ? this.Es(t2) : null == (r2 = h.__PosthogExtensions__) || null == r2.loadExternalDependency || r2.loadExternalDependency(this._instance, this.Ms, ((e3) => {
      if (e3) return Qo.error("could not load recorder", e3);
      this.Es(t2);
    })));
  }
  stopRecording() {
    var t2, e2;
    null == (t2 = this.Cs) || t2.call(this), this.Cs = void 0, null == (e2 = this.Ss) || e2.stop();
  }
  Ps() {
    var t2, e2;
    null == (t2 = this.Cs) || t2.call(this), this.Cs = void 0, null == (e2 = this.Ss) || e2.discard();
  }
  Rs() {
    var t2;
    null == (t2 = this.ni) || t2.unregister(li);
  }
  Os(t2, e2) {
    if (H(t2)) return null;
    var i2, r2 = q(t2) ? t2 : parseFloat(t2);
    return "number" != typeof (i2 = r2) || !Number.isFinite(i2) || 0 > i2 || i2 > 1 ? (Qo.warn(e2 + " must be between 0 and 1. Ignoring invalid value:", t2), null) : r2;
  }
  Ls(t2) {
    if (this.ni) {
      var e2, i2, r2 = this.ni, s2 = () => {
        var e3, i3 = false === t2.sessionRecording ? void 0 : t2.sessionRecording, s3 = this.Os(null == (e3 = this.qt.session_recording) ? void 0 : e3.sampleRate, "session_recording.sampleRate"), n2 = this.Os(null == i3 ? void 0 : i3.sampleRate, "remote config sampleRate"), o2 = null != s3 ? s3 : n2;
        H(o2) && this.Rs();
        var a2 = null == i3 ? void 0 : i3.minimumDurationMilliseconds;
        r2.register({ [ii]: f({ cache_timestamp: Date.now(), enabled: !!i3 }, i3, { networkPayloadCapture: f({ capturePerformance: t2.capturePerformance }, null == i3 ? void 0 : i3.networkPayloadCapture), canvasRecording: { enabled: null == i3 ? void 0 : i3.recordCanvas, fps: null == i3 ? void 0 : i3.canvasFps, quality: null == i3 ? void 0 : i3.canvasQuality }, sampleRate: o2, minimumDurationMilliseconds: N(a2) ? null : a2, endpoint: null == i3 ? void 0 : i3.endpoint, triggerMatchType: null == i3 ? void 0 : i3.triggerMatchType, masking: null == i3 ? void 0 : i3.masking, urlTriggers: null == i3 ? void 0 : i3.urlTriggers, version: null == i3 ? void 0 : i3.version, triggerGroups: null == i3 ? void 0 : i3.triggerGroups }) });
      };
      s2(), null == (e2 = this.Cs) || e2.call(this), this.Cs = null == (i2 = this._instance.sessionManager) ? void 0 : i2.onSessionId(s2);
    }
  }
  onRemoteConfig(t2) {
    return "sessionRecording" in t2 ? false === t2.sessionRecording ? (this.Ls(t2), void this.Ps()) : (this.Ls(t2), void this.startIfEnabledOrStop()) : (this.ks === Jo && (this.ks = Ko, Qo.warn("config refresh failed, recording will not start until page reload")), void this.startIfEnabledOrStop());
  }
  log(t2, e2) {
    var i2;
    void 0 === e2 && (e2 = "log"), null != (i2 = this.Ss) && i2.log ? this.Ss.log(t2, e2) : Qo.warn("log called before recorder was ready");
  }
  get Ms() {
    var t2, e2, i2 = null == (t2 = this._instance) || null == (t2 = t2.persistence) ? void 0 : t2.get_property(ii);
    return (null == i2 || null == (e2 = i2.scriptConfig) ? void 0 : e2.script) || "lazy-recorder";
  }
  Fs() {
    var t2, e2, i2 = this._instance.get_property(ii);
    if (!i2) return false;
    try {
      e2 = "object" == typeof i2 ? i2 : JSON.parse(i2);
    } catch (t3) {
      return Qo.warn("persisted remote config for session recording is invalid and will be ignored", t3), false;
    }
    var r2 = null !== (t2 = e2.cache_timestamp) && void 0 !== t2 ? t2 : Date.now();
    return 36e5 >= Date.now() - r2;
  }
  Es(t2) {
    var e2, i2;
    if (null == (e2 = h.__PosthogExtensions__) || !e2.initSessionRecording) return Qo.warn("Called on script loaded before session recording is available. This can be caused by adblockers."), void this._instance.register_for_session({ [Ui]: true });
    if (this.Ss || (this.Ss = null == (i2 = h.__PosthogExtensions__) ? void 0 : i2.initSessionRecording(this._instance), this.Ss._forceAllowLocalhostNetworkCapture = this._forceAllowLocalhostNetworkCapture), !this.Fs()) {
      if (this.ks === Ko || this.ks === Jo) return;
      return this.ks = Jo, Qo.info("persisted remote config is stale, requesting fresh config before starting"), void new ys(this._instance).load();
    }
    this.ks = Yo, this.Ss.start(t2);
  }
  onRRwebEmit(t2) {
    var e2;
    null == (e2 = this.Ss) || null == e2.onRRwebEmit || e2.onRRwebEmit(t2);
  }
  overrideLinkedFlag() {
    var t2, e2;
    this.Ss || null == (e2 = this.ni) || e2.register({ [si]: true }), null == (t2 = this.Ss) || t2.overrideLinkedFlag();
  }
  overrideSampling() {
    var t2, e2;
    this.Ss || null == (e2 = this.ni) || e2.register({ [ri]: true }), null == (t2 = this.Ss) || t2.overrideSampling();
  }
  overrideTrigger(t2) {
    var e2, i2;
    this.Ss || null == (i2 = this.ni) || i2.register({ ["url" === t2 ? ni : oi]: true }), null == (e2 = this.Ss) || e2.overrideTrigger(t2);
  }
  get sdkDebugProperties() {
    var t2;
    return (null == (t2 = this.Ss) ? void 0 : t2.sdkDebugProperties) || { $recording_status: this.status };
  }
  tryAddCustomEvent(t2, e2) {
    var i2;
    return !(null == (i2 = this.Ss) || !i2.tryAddCustomEvent(t2, e2));
  }
} }, ka = { autocapture: class {
  constructor(t2) {
    this.As = false, this.Ns = null, this.$s = false, this.instance = t2, this.rageclicks = new Do(t2.config.rageclick), this.Ds = null;
  }
  initialize() {
    this.startIfEnabled();
  }
  get qt() {
    var t2, e2, i2 = U(this.instance.config.autocapture) ? this.instance.config.autocapture : {};
    return i2.url_allowlist = null == (t2 = i2.url_allowlist) ? void 0 : t2.map(((t3) => new RegExp(t3))), i2.url_ignorelist = null == (e2 = i2.url_ignorelist) ? void 0 : e2.map(((t3) => new RegExp(t3))), i2;
  }
  qs() {
    if (this.isBrowserSupported()) {
      if (t && r) {
        var e2 = (e3) => {
          e3 = e3 || (null == t ? void 0 : t.event);
          try {
            this.js(e3);
          } catch (t2) {
            Lo.error("Failed to capture event", t2);
          }
        };
        if (nr(r, "submit", e2, { capture: true }), nr(r, "change", e2, { capture: true }), nr(r, "click", e2, { capture: true }), this.qt.capture_copied_text) {
          var i2 = (e3) => {
            e3 = e3 || (null == t ? void 0 : t.event);
            try {
              this.js(e3, Uo);
            } catch (t2) {
              Lo.error("Failed to capture copy/cut event", t2);
            }
          };
          nr(r, "copy", i2, { capture: true }), nr(r, "cut", i2, { capture: true });
        }
      }
    } else Lo.info("Disabling Automatic Event Collection because this browser is not supported");
  }
  startIfEnabled() {
    this.isEnabled && !this.As && (this.qs(), this.As = true);
  }
  onRemoteConfig(t2) {
    t2.elementsChainAsString && (this.$s = t2.elementsChainAsString), this.instance.persistence && this.instance.persistence.register({ [Ge]: !!t2.autocapture_opt_out }), this.Ns = !!t2.autocapture_opt_out, this.startIfEnabled();
  }
  setElementSelectors(t2) {
    this.Ds = t2;
  }
  getElementSelectors(t2) {
    var e2, i2 = [];
    return null == (e2 = this.Ds) || e2.forEach(((e3) => {
      var s2 = null == r ? void 0 : r.querySelectorAll(e3);
      null == s2 || s2.forEach(((r2) => {
        t2 === r2 && i2.push(e3);
      }));
    })), i2;
  }
  get isEnabled() {
    var t2, e2, i2 = null == (t2 = this.instance.persistence) ? void 0 : t2.props[Ge];
    if (B(this.Ns) && !W(i2) && !this.instance.Lr()) return false;
    var r2 = null !== (e2 = this.Ns) && void 0 !== e2 ? e2 : !!i2;
    return !!this.instance.config.autocapture && !r2;
  }
  js(e2, i2) {
    if (void 0 === i2 && (i2 = "$autocapture"), this.isEnabled) {
      var r2, s2 = fo(e2);
      ao(s2) && (s2 = s2.parentNode || null), "$autocapture" === i2 && "click" === e2.type && e2 instanceof MouseEvent && this.instance.config.rageclick && null != (r2 = this.rageclicks) && r2.isRageClick(e2.clientX, e2.clientY, e2.timeStamp || (/* @__PURE__ */ new Date()).getTime()) && (function(e3, i3) {
        if (!t || wo(e3)) return false;
        var r3, s3, n3;
        if (W(i3) ? (r3 = !!i3 && yo, s3 = void 0) : (r3 = null !== (n3 = null == i3 ? void 0 : i3.css_selector_ignorelist) && void 0 !== n3 ? n3 : yo, s3 = null == i3 ? void 0 : i3.content_ignorelist), false === r3) return false;
        var { targetElementList: o3 } = xo(e3, false);
        return !(function(t2, e4) {
          if (false === t2 || N(t2)) return false;
          var i4;
          if (true === t2) i4 = bo;
          else {
            if (!M(t2)) return false;
            if (t2.length > 10) return Ne.error("[PostHog] content_ignorelist array cannot exceed 10 items. Use css_selector_ignorelist for more complex matching."), false;
            i4 = t2.map(((t3) => t3.toLowerCase()));
          }
          return e4.some(((t3) => {
            var { safeText: e5, ariaLabel: r4 } = t3;
            return i4.some(((t4) => e5.includes(t4) || r4.includes(t4)));
          }));
        })(s3, o3.map(((t2) => {
          var e4;
          return { safeText: po(t2).toLowerCase(), ariaLabel: (null == (e4 = t2.getAttribute("aria-label")) ? void 0 : e4.toLowerCase().trim()) || "" };
        }))) && !go(o3, r3);
      })(s2, this.instance.config.rageclick) && this.js(e2, "$rageclick");
      var n2 = i2 === Uo;
      if (s2 && (function(e3, i3, r3, s3, n3) {
        var o3, a3, l3, u3;
        if (void 0 === r3 && (r3 = void 0), !t || wo(e3)) return false;
        if (null != (o3 = r3) && o3.url_allowlist && !ho(r3.url_allowlist)) return false;
        if (null != (a3 = r3) && a3.url_ignorelist && ho(r3.url_ignorelist)) return false;
        if (null != (l3 = r3) && l3.dom_event_allowlist) {
          var h3 = r3.dom_event_allowlist;
          if (h3 && !h3.some(((t2) => i3.type === t2))) return false;
        }
        var { parentIsUsefulElement: d3, targetElementList: v2 } = xo(e3, s3);
        if (!(function(t2, e4) {
          var i4 = null == e4 ? void 0 : e4.element_allowlist;
          if (N(i4)) return true;
          var r4, s4 = function(t3) {
            if (i4.some(((e5) => t3.tagName.toLowerCase() === e5))) return { v: true };
          };
          for (var n4 of t2) if (r4 = s4(n4)) return r4.v;
          return false;
        })(v2, r3)) return false;
        if (!go(v2, null == (u3 = r3) ? void 0 : u3.css_selector_allowlist)) return false;
        var c2 = t.getComputedStyle(e3);
        if (c2 && "pointer" === c2.getPropertyValue("cursor") && "click" === i3.type) return true;
        var p2 = e3.tagName.toLowerCase();
        switch (p2) {
          case "html":
            return false;
          case "form":
            return (n3 || ["submit"]).indexOf(i3.type) >= 0;
          case "input":
          case "select":
          case "textarea":
            return (n3 || ["change", "click"]).indexOf(i3.type) >= 0;
          default:
            return d3 ? (n3 || ["click"]).indexOf(i3.type) >= 0 : (n3 || ["click"]).indexOf(i3.type) >= 0 && (_o.indexOf(p2) > -1 || "true" === e3.getAttribute("contenteditable"));
        }
      })(s2, e2, this.qt, n2, n2 ? ["copy", "cut"] : void 0)) {
        var { props: o2, explicitNoCapture: a2 } = zo(s2, { e: e2, maskAllElementAttributes: this.instance.config.mask_all_element_attributes, maskAllText: this.instance.config.mask_all_text, elementAttributeIgnoreList: this.qt.element_attribute_ignorelist, elementsChainAsString: this.$s });
        if (a2) return false;
        var l2 = this.getElementSelectors(s2);
        if (l2 && l2.length > 0 && (o2.$element_selectors = l2), i2 === Uo) {
          var u2, h2 = co(null == t || null == (u2 = t.getSelection()) ? void 0 : u2.toString()), d2 = e2.type || "clipboard";
          if (!h2) return false;
          o2.$selected_content = h2, o2.$copy_type = d2;
        }
        return this.instance.capture(i2, o2), true;
      }
    }
  }
  isBrowserSupported() {
    return D(null == r ? void 0 : r.querySelectorAll);
  }
}, historyAutocapture: class {
  constructor(e2) {
    var i2;
    this._instance = e2, this.Hs = (null == t || null == (i2 = t.location) ? void 0 : i2.pathname) || "";
  }
  initialize() {
    this.startIfEnabled();
  }
  get isEnabled() {
    return "history_change" === this._instance.config.capture_pageview;
  }
  startIfEnabled() {
    this.isEnabled && (Ne.info("History API monitoring enabled, starting..."), this.monitorHistoryChanges());
  }
  stop() {
    this.Us && this.Us(), this.Us = void 0, Ne.info("History API monitoring stopped");
  }
  monitorHistoryChanges() {
    var e2, i2;
    if (t && t.history) {
      var r2 = this;
      null != (e2 = t.history.pushState) && e2.__posthog_wrapped__ || Ho(t.history, "pushState", ((t2) => function(e3, i3, s2) {
        t2.call(this, e3, i3, s2), r2.Bs("pushState");
      })), null != (i2 = t.history.replaceState) && i2.__posthog_wrapped__ || Ho(t.history, "replaceState", ((t2) => function(e3, i3, s2) {
        t2.call(this, e3, i3, s2), r2.Bs("replaceState");
      })), this.zs();
    }
  }
  Bs(e2) {
    try {
      var i2, r2 = null == t || null == (i2 = t.location) ? void 0 : i2.pathname;
      if (!r2) return;
      r2 !== this.Hs && this.isEnabled && this._instance.capture(Wi, { navigation_type: e2 }), this.Hs = r2;
    } catch (t2) {
      Ne.error("Error capturing " + e2 + " pageview", t2);
    }
  }
  zs() {
    if (!this.Us) {
      var e2 = () => {
        this.Bs("popstate");
      };
      nr(t, "popstate", e2), this.Us = () => {
        t && t.removeEventListener("popstate", e2);
      };
    }
  }
}, heatmaps: class {
  get qt() {
    return this.instance.config;
  }
  constructor(t2) {
    var e2;
    this.Vs = false, this.As = false, this.Ws = null, this.instance = t2, this.Vs = !(null == (e2 = this.instance.persistence) || !e2.props[Ye]), this.rageclicks = new Do(t2.config.rageclick);
  }
  initialize() {
    this.startIfEnabled();
  }
  get flushIntervalMilliseconds() {
    var t2 = 5e3;
    return U(this.qt.capture_heatmaps) && this.qt.capture_heatmaps.flush_interval_milliseconds && (t2 = this.qt.capture_heatmaps.flush_interval_milliseconds), t2;
  }
  get isEnabled() {
    return H(this.qt.capture_heatmaps) ? H(this.qt.enable_heatmaps) ? this.Vs : this.qt.enable_heatmaps : false !== this.qt.capture_heatmaps;
  }
  startIfEnabled() {
    if (this.isEnabled) {
      if (this.As) return;
      Zo.info("starting..."), this.Zs(), this.At();
    } else {
      var t2;
      clearInterval(null !== (t2 = this.Ws) && void 0 !== t2 ? t2 : void 0), this.Gs(), this.getAndClearBuffer();
    }
  }
  onRemoteConfig(t2) {
    if ("heatmaps" in t2) {
      var e2 = !!t2.heatmaps;
      this.instance.persistence && this.instance.persistence.register({ [Ye]: e2 }), this.Vs = e2, this.startIfEnabled();
    }
  }
  getAndClearBuffer() {
    var t2 = this.M;
    return this.M = void 0, t2;
  }
  Qs(t2) {
    this.Mt(t2.originalEvent, "deadclick");
  }
  At() {
    this.Ws && clearInterval(this.Ws), this.Ws = "visible" === (null == r ? void 0 : r.visibilityState) ? setInterval(this.Zr.bind(this), this.flushIntervalMilliseconds) : null;
  }
  Zs() {
    t && r && (this.Js = this.Zr.bind(this), nr(t, Vi, this.Js), this.Ks = (e2) => this.Mt(e2 || (null == t ? void 0 : t.event)), nr(r, "click", this.Ks, { capture: true }), this.Ys = (e2) => this.Xs(e2 || (null == t ? void 0 : t.event)), nr(r, "mousemove", this.Ys, { capture: true }), this.eo = new Rr(this.instance, Tr, this.Qs.bind(this)), this.eo.startIfEnabledOrStop(), this.ro = this.At.bind(this), nr(r, qi, this.ro), this.As = true);
  }
  Gs() {
    var e2;
    t && r && (this.Js && t.removeEventListener(Vi, this.Js), this.Ks && r.removeEventListener("click", this.Ks, { capture: true }), this.Ys && r.removeEventListener("mousemove", this.Ys, { capture: true }), this.ro && r.removeEventListener(qi, this.ro), clearTimeout(this.io), null == (e2 = this.eo) || e2.stop(), this.As = false);
  }
  no(e2, i2) {
    var r2 = this.instance.scrollManager.scrollY(), s2 = this.instance.scrollManager.scrollX(), n2 = this.instance.scrollManager.scrollElement(), o2 = (function(e3, i3, r3) {
      for (var s3 = e3; s3 && no(s3) && !oo(s3, "body"); ) {
        if (s3 === r3) return false;
        if (P(i3, null == t ? void 0 : t.getComputedStyle(s3).position)) return true;
        s3 = mo(s3);
      }
      return false;
    })(fo(e2), ["fixed", "sticky"], n2);
    return { x: e2.clientX + (o2 ? 0 : s2), y: e2.clientY + (o2 ? 0 : r2), target_fixed: o2, type: i2 };
  }
  Mt(t2, e2) {
    var i2;
    if (void 0 === e2 && (e2 = "click"), !so(t2.target) && ta(t2)) {
      var r2 = this.no(t2, e2);
      null != (i2 = this.rageclicks) && i2.isRageClick(t2.clientX, t2.clientY, (/* @__PURE__ */ new Date()).getTime()) && this.so(f({}, r2, { type: "rageclick" })), this.so(r2);
    }
  }
  Xs(t2) {
    !so(t2.target) && ta(t2) && (clearTimeout(this.io), this.io = setTimeout((() => {
      this.so(this.no(t2, "mousemove"));
    }), 500));
  }
  so(e2) {
    if (t) {
      var i2 = t.location.href, r2 = this.qt.custom_personal_data_properties, s2 = this.qt.mask_personal_data_properties ? [...zr, ...r2 || []] : [], n2 = Lr(i2, s2, Hr);
      this.M = this.M || {}, this.M[n2] || (this.M[n2] = []), this.M[n2].push(e2);
    }
  }
  Zr() {
    this.M && !L(this.M) && this.instance.capture("$$heatmap", { $heatmap_data: this.getAndClearBuffer() });
  }
}, deadClicksAutocapture: Rr, webVitalsAutocapture: class {
  constructor(t2) {
    var e2;
    this.Vs = false, this.As = false, this.M = { url: void 0, metrics: [], firstMetricTimestamp: void 0 }, this.oo = () => {
      clearTimeout(this.ao), 0 !== this.M.metrics.length && (this._instance.capture("$web_vitals", this.M.metrics.reduce(((t3, e3) => f({}, t3, { ["$web_vitals_" + e3.name + "_event"]: f({}, e3), ["$web_vitals_" + e3.name + "_value"]: e3.value })), {})), this.M = { url: void 0, metrics: [], firstMetricTimestamp: void 0 });
    }, this.ht = (t3) => {
      var e3;
      this.M = this.M || { url: void 0, metrics: [], firstMetricTimestamp: void 0 };
      var i2 = this.uo();
      if (!N(i2)) if (H(null == t3 ? void 0 : t3.name) || H(null == t3 ? void 0 : t3.value)) Vo.error("Invalid metric received", t3);
      else if (!this.lo || this.lo > t3.value) {
        this.M.url !== i2 && (this.oo(), this.ao = setTimeout(this.oo, this.flushToCaptureTimeoutMs)), N(this.M.url) && (this.M.url = i2), this.M.firstMetricTimestamp = N(this.M.firstMetricTimestamp) ? Date.now() : this.M.firstMetricTimestamp, t3.attribution && t3.attribution.interactionTargetElement && (t3.attribution.interactionTargetElement = void 0);
        var r2 = null == (e3 = this._instance.sessionManager) ? void 0 : e3.checkAndGetSessionAndWindowId(true), s2 = f({}, t3, { $current_url: i2, timestamp: Date.now() });
        N(r2) || (s2.$session_id = r2.sessionId, s2.$window_id = r2.windowId), this.M.metrics.push(s2), this.M.metrics.length === this.allowedMetrics.length && this.oo();
      } else Vo.error("Ignoring metric with value >= " + this.lo, t3);
    }, this.ho = () => {
      if (!this.As) {
        var t3, e3, i2, r2, s2 = h.__PosthogExtensions__;
        N(s2) || N(s2.postHogWebVitalsCallbacks) || ({ onLCP: t3, onCLS: e3, onFCP: i2, onINP: r2 } = s2.postHogWebVitalsCallbacks), t3 && e3 && i2 && r2 ? (this.allowedMetrics.indexOf("LCP") > -1 && t3(this.ht.bind(this)), this.allowedMetrics.indexOf("CLS") > -1 && e3(this.ht.bind(this)), this.allowedMetrics.indexOf("FCP") > -1 && i2(this.ht.bind(this)), this.allowedMetrics.indexOf("INP") > -1 && r2(this.ht.bind(this)), this.As = true) : Vo.error("web vitals callbacks not loaded - not starting");
      }
    }, this._instance = t2, this.Vs = !(null == (e2 = this._instance.persistence) || !e2.props[Qe]), this.startIfEnabled();
  }
  get co() {
    return this._instance.config.capture_performance;
  }
  get allowedMetrics() {
    var t2, e2, i2 = U(this.co) ? null == (t2 = this.co) ? void 0 : t2.web_vitals_allowed_metrics : void 0;
    return H(i2) ? (null == (e2 = this._instance.persistence) ? void 0 : e2.props[ei]) || ["CLS", "FCP", "INP", "LCP"] : i2;
  }
  get flushToCaptureTimeoutMs() {
    return (U(this.co) ? this.co.web_vitals_delayed_flush_ms : void 0) || 5e3;
  }
  get useAttribution() {
    var t2 = U(this.co) ? this.co.web_vitals_attribution : void 0;
    return null != t2 && t2;
  }
  get lo() {
    var t2 = U(this.co) && q(this.co.__web_vitals_max_value) ? this.co.__web_vitals_max_value : Wo;
    return t2 > 0 && 6e4 >= t2 ? Wo : t2;
  }
  get isEnabled() {
    var t2 = null == s ? void 0 : s.protocol;
    if ("http:" !== t2 && "https:" !== t2) return Vo.info("Web Vitals are disabled on non-http/https protocols"), false;
    var e2 = U(this.co) ? this.co.web_vitals : W(this.co) ? this.co : void 0;
    return W(e2) ? e2 : this.Vs;
  }
  startIfEnabled() {
    this.isEnabled && !this.As && (Vo.info("enabled, starting..."), this.lr(this.ho));
  }
  onRemoteConfig(t2) {
    if ("capturePerformance" in t2) {
      var e2 = U(t2.capturePerformance) && !!t2.capturePerformance.web_vitals, i2 = U(t2.capturePerformance) ? t2.capturePerformance.web_vitals_allowed_metrics : void 0;
      this._instance.persistence && (this._instance.persistence.register({ [Qe]: e2 }), this._instance.persistence.register({ [ei]: i2 })), this.Vs = e2, this.startIfEnabled();
    }
  }
  lr(t2) {
    var e2, i2;
    null != (e2 = h.__PosthogExtensions__) && e2.postHogWebVitalsCallbacks ? t2() : null == (i2 = h.__PosthogExtensions__) || null == i2.loadExternalDependency || i2.loadExternalDependency(this._instance, this.useAttribution ? "web-vitals-with-attribution" : "web-vitals", ((e3) => {
      e3 ? Vo.error("failed to load script", e3) : t2();
    }));
  }
  uo() {
    var e2 = t ? t.location.href : void 0;
    if (e2) {
      var i2 = this._instance.config.custom_personal_data_properties, r2 = this._instance.config.mask_personal_data_properties ? [...zr, ...i2 || []] : [];
      return Lr(e2, r2, Hr);
    }
    Vo.error("Could not determine current URL");
  }
} }, Ra = { exceptionObserver: class {
  constructor(e2) {
    var i2, r2, s2;
    this.ho = () => {
      var e3;
      if (t && this.isEnabled && null != (e3 = h.__PosthogExtensions__) && e3.errorWrappingFunctions) {
        var i3 = h.__PosthogExtensions__.errorWrappingFunctions.wrapOnError, r3 = h.__PosthogExtensions__.errorWrappingFunctions.wrapUnhandledRejection, s3 = h.__PosthogExtensions__.errorWrappingFunctions.wrapConsoleError;
        try {
          !this.do && this.qt.capture_unhandled_errors && (this.do = i3(this.captureException.bind(this))), !this.vo && this.qt.capture_unhandled_rejections && (this.vo = r3(this.captureException.bind(this))), !this.fo && this.qt.capture_console_errors && (this.fo = s3(this.captureException.bind(this)));
        } catch (t2) {
          Bo.error("failed to start", t2), this.po();
        }
      }
    }, this._instance = e2, this.mo = !(null == (i2 = this._instance.persistence) || !i2.props[Je]), this.yo = new it({ refillRate: null !== (r2 = this._instance.config.error_tracking.__exceptionRateLimiterRefillRate) && void 0 !== r2 ? r2 : 1, bucketSize: null !== (s2 = this._instance.config.error_tracking.__exceptionRateLimiterBucketSize) && void 0 !== s2 ? s2 : 10, refillInterval: 1e4, Gt: Bo }), this.qt = this.bo(), this.startIfEnabledOrStop();
  }
  bo() {
    var t2 = this._instance.config.capture_exceptions, e2 = { capture_unhandled_errors: false, capture_unhandled_rejections: false, capture_console_errors: false };
    return U(t2) ? e2 = f({}, e2, t2) : (N(t2) ? this.mo : t2) && (e2 = f({}, e2, { capture_unhandled_errors: true, capture_unhandled_rejections: true })), e2;
  }
  get isEnabled() {
    return this.qt.capture_console_errors || this.qt.capture_unhandled_errors || this.qt.capture_unhandled_rejections;
  }
  startIfEnabledOrStop() {
    this.isEnabled ? (Bo.info("enabled"), this.po(), this.lr(this.ho)) : this.po();
  }
  lr(t2) {
    var e2, i2;
    null != (e2 = h.__PosthogExtensions__) && e2.errorWrappingFunctions && t2(), null == (i2 = h.__PosthogExtensions__) || null == i2.loadExternalDependency || i2.loadExternalDependency(this._instance, "exception-autocapture", ((e3) => {
      if (e3) return Bo.error("failed to load script", e3);
      t2();
    }));
  }
  po() {
    var t2, e2, i2;
    null == (t2 = this.do) || t2.call(this), this.do = void 0, null == (e2 = this.vo) || e2.call(this), this.vo = void 0, null == (i2 = this.fo) || i2.call(this), this.fo = void 0;
  }
  onRemoteConfig(t2) {
    "autocaptureExceptions" in t2 && (this.mo = !!t2.autocaptureExceptions || false, this._instance.persistence && this._instance.persistence.register({ [Je]: this.mo }), this.qt = this.bo(), this.startIfEnabledOrStop());
  }
  onConfigChange() {
    this.qt = this.bo();
  }
  captureException(t2) {
    var e2, i2, r2, s2 = null !== (e2 = null == t2 || null == (i2 = t2.$exception_list) || null == (i2 = i2[0]) ? void 0 : i2.type) && void 0 !== e2 ? e2 : "Exception";
    this.yo.consumeRateLimit(s2) ? Bo.info("Skipping exception capture because of client rate limiting.", { exception: s2 }) : null == (r2 = this._instance.exceptions) || r2.sendExceptionEvent(t2);
  }
}, exceptions: class {
  constructor(t2) {
    var e2, i2;
    this._o = [], this.wo = new le([new ye(), new Oe(), new xe(), new we(), new Re(), new ke(), new Se(), new Pe()], (function(t3) {
      for (var e3 = arguments.length, i3 = new Array(e3 > 1 ? e3 - 1 : 0), r2 = 1; e3 > r2; r2++) i3[r2 - 1] = arguments[r2];
      return function(e4, r3) {
        void 0 === r3 && (r3 = 0);
        for (var s2 = [], n2 = e4.split("\n"), o2 = r3; n2.length > o2; o2++) {
          var a2 = n2[o2];
          if (1024 >= a2.length) {
            var l2 = be.test(a2) ? a2.replace(be, "$1") : a2;
            if (!l2.match(/\S*Error: /)) {
              for (var u2 of i3) {
                var h2 = u2(l2, t3);
                if (h2) {
                  s2.push(h2);
                  break;
                }
              }
              if (s2.length >= 50) break;
            }
          }
        }
        return (function(t4) {
          if (!t4.length) return [];
          var e5 = Array.from(t4);
          return e5.reverse(), e5.slice(0, 50).map(((t5) => {
            return f({}, t5, { filename: t5.filename || (i4 = e5, i4[i4.length - 1] || {}).filename, function: t5.function || ue });
            var i4;
          }));
        })(s2);
      };
    })("web:javascript", fe, me)), this._instance = t2, this._o = null !== (e2 = null == (i2 = this._instance.persistence) ? void 0 : i2.get_property(Ke)) && void 0 !== e2 ? e2 : [], this.xo = Me(this.So()), this.ko = new De(this.xo);
  }
  onConfigChange() {
    this.xo = Me(this.So()), this.ko.setConfig(this.xo);
  }
  onRemoteConfig(t2) {
    var e2, i2, r2;
    if ("errorTracking" in t2) {
      var s2 = null !== (e2 = null == (i2 = t2.errorTracking) ? void 0 : i2.suppressionRules) && void 0 !== e2 ? e2 : [], n2 = null == (r2 = t2.errorTracking) ? void 0 : r2.captureExtensionExceptions;
      this._o = s2, this._instance.persistence && this._instance.persistence.register({ [Ke]: this._o, [Xe]: n2 });
    }
  }
  get Co() {
    var t2, e2 = !!this._instance.get_property(Xe), i2 = this._instance.config.error_tracking.captureExtensionExceptions;
    return null !== (t2 = null != i2 ? i2 : e2) && void 0 !== t2 && t2;
  }
  buildProperties(t2, e2) {
    return this.wo.buildFromUnknown(t2, { syntheticException: null == e2 ? void 0 : e2.syntheticException, mechanism: { handled: null == e2 ? void 0 : e2.handled } });
  }
  addExceptionStep(t2, e2) {
    if (this.xo.enabled) try {
      if (!j(t2) || 0 === t2.trim().length) return void ba.warn("Ignoring exception step because message must be a non-empty string");
      var i2 = this.Io(e2), { sanitizedProperties: r2, droppedKeys: s2 } = (function(t3) {
        if (!t3) return { sanitizedProperties: {}, droppedKeys: [] };
        var e3 = [];
        return { sanitizedProperties: Object.keys(t3).reduce(((i3, r3) => Ae.has(r3) ? (e3.push(r3), i3) : (i3[r3] = t3[r3], i3)), {}), droppedKeys: e3 };
      })(i2);
      s2.length > 0 && ba.warn("Ignoring reserved exception step fields", { droppedKeys: s2 }), this.ko.add(f({ [Ie]: t2, [Ce]: (/* @__PURE__ */ new Date()).toISOString() }, r2));
    } catch (t3) {
      ba.error("Failed to add exception step. Ignoring breadcrumb.", t3);
    }
  }
  sendExceptionEvent(t2) {
    try {
      var e2 = t2.$exception_list;
      if (this.To(e2)) {
        if (this.Eo(e2)) return this.Mo("Exception dropped: matched a suppression rule"), void ba.info("Skipping exception capture because a suppression rule matched");
        if (!this.Co && this.Po(e2)) return this.Mo("Exception dropped: thrown by a browser extension"), void ba.info("Skipping exception capture because it was thrown by an extension");
        if (!this._instance.config.error_tracking.__capturePostHogExceptions && this.Ro(e2)) return this.Mo("Exception dropped: thrown by the PostHog SDK"), void ba.info("Skipping exception capture because it was thrown by the PostHog SDK");
      }
      var i2 = this.xo.enabled && H(t2.$exception_steps) ? this.Oo(t2) : t2;
      try {
        var r2 = this._instance.capture("$exception", i2, { _noTruncate: true, _batchKey: "exceptionEvent", sn: true });
        return r2 && this.ko.clear(), r2;
      } catch (t3) {
        return ba.error("Failed to capture exception event. Dropping this exception.", t3), void this.ko.clear();
      }
    } catch (t3) {
      return void ba.error("Failed to process exception event. Ignoring this exception.", t3);
    }
  }
  Oo(t2) {
    try {
      var e2 = this.ko.getAttachable();
      return 0 === e2.length ? t2 : f({}, t2, { $exception_steps: e2 });
    } catch (e3) {
      return ba.error("Failed to read buffered exception steps. Capturing exception without steps.", e3), t2;
    }
  }
  Mo(t2) {
    this.xo.enabled && this.ko.add({ [Ie]: t2, [Ce]: (/* @__PURE__ */ new Date()).toISOString() });
  }
  Io(t2) {
    return U(t2) ? f({}, t2) : {};
  }
  So() {
    var t2, e2;
    return null !== (t2 = null == (e2 = this._instance.config.error_tracking) ? void 0 : e2.exception_steps) && void 0 !== t2 ? t2 : {};
  }
  Eo(t2) {
    if (0 === t2.length) return false;
    var e2 = t2.reduce(((t3, e3) => {
      var { type: i2, value: r2 } = e3;
      return j(i2) && i2.length > 0 && t3.$exception_types.push(i2), j(r2) && r2.length > 0 && t3.$exception_values.push(r2), t3;
    }), { $exception_types: [], $exception_values: [] });
    return this._o.some(((t3) => {
      var i2 = t3.values.map(((t4) => {
        var i3, r2 = Tn[t4.operator], s2 = M(t4.value) ? t4.value : [t4.value], n2 = null !== (i3 = e2[t4.key]) && void 0 !== i3 ? i3 : [];
        return s2.length > 0 && r2(s2, n2);
      }));
      return "OR" === t3.type ? i2.some(Boolean) : i2.every(Boolean);
    }));
  }
  Po(t2) {
    return t2.flatMap(((t3) => {
      var e2, i2;
      return null !== (e2 = null == (i2 = t3.stacktrace) ? void 0 : i2.frames) && void 0 !== e2 ? e2 : [];
    })).some(((t3) => t3.filename && t3.filename.startsWith("chrome-extension://")));
  }
  Ro(t2) {
    if (t2.length > 0) {
      var e2, i2, r2, s2, n2 = null !== (e2 = null == (i2 = t2[0].stacktrace) ? void 0 : i2.frames) && void 0 !== e2 ? e2 : [], o2 = n2[n2.length - 1];
      return null !== (r2 = null == o2 || null == (s2 = o2.filename) ? void 0 : s2.includes("posthog.com/static")) && void 0 !== r2 && r2;
    }
    return false;
  }
  To(t2) {
    return !H(t2) && M(t2);
  }
} }, Pa = f({ productTours: class {
  get ni() {
    return this._instance.persistence;
  }
  constructor(t2) {
    this.Lo = null, this.Fo = null, this._instance = t2;
  }
  initialize() {
    this.loadIfEnabled();
  }
  onRemoteConfig(t2) {
    "productTours" in t2 && (this.ni && this.ni.register({ [ti]: !!t2.productTours }), this.loadIfEnabled());
  }
  loadIfEnabled() {
    var t2, e2;
    this.Lo || (t2 = this._instance).config.disable_product_tours || null == (e2 = t2.persistence) || !e2.get_property(ti) || this.lr((() => this.Ao()));
  }
  lr(t2) {
    var e2, i2;
    null != (e2 = h.__PosthogExtensions__) && e2.generateProductTours ? t2() : null == (i2 = h.__PosthogExtensions__) || null == i2.loadExternalDependency || i2.loadExternalDependency(this._instance, "product-tours", ((e3) => {
      e3 ? ea.error("Could not load product tours script", e3) : t2();
    }));
  }
  Ao() {
    var t2;
    !this.Lo && null != (t2 = h.__PosthogExtensions__) && t2.generateProductTours && (this.Lo = h.__PosthogExtensions__.generateProductTours(this._instance, true));
  }
  getProductTours(t2, e2) {
    if (void 0 === e2 && (e2 = false), !M(this.Fo) || e2) {
      var i2 = this.ni;
      if (i2) {
        var r2 = i2.props[wi];
        if (M(r2) && !e2) return this.Fo = r2, void t2(r2, { isLoaded: true });
      }
      this._instance._send_request({ url: this._instance.requestRouter.endpointFor("api", "/api/product_tours/?token=" + this._instance.config.token), method: "GET", callback: (e3) => {
        var r3 = e3.statusCode;
        if (200 !== r3 || !e3.json) {
          var s2 = "Product Tours API could not be loaded, status: " + r3;
          return ea.error(s2), void t2([], { isLoaded: false, error: s2 });
        }
        var n2 = M(e3.json.product_tours) ? e3.json.product_tours : [];
        this.Fo = n2, i2 && i2.register({ [wi]: n2 }), t2(n2, { isLoaded: true });
      } });
    } else t2(this.Fo, { isLoaded: true });
  }
  getActiveProductTours(t2) {
    H(this.Lo) ? t2([], { isLoaded: false, error: "Product tours not loaded" }) : this.Lo.getActiveProductTours(t2);
  }
  showProductTour(t2) {
    var e2;
    null == (e2 = this.Lo) || e2.showTourById(t2);
  }
  previewTour(t2) {
    this.Lo ? this.Lo.previewTour(t2) : this.lr((() => {
      var e2;
      this.Ao(), null == (e2 = this.Lo) || e2.previewTour(t2);
    }));
  }
  dismissProductTour() {
    var t2;
    null == (t2 = this.Lo) || t2.dismissTour("user_clicked_skip");
  }
  nextStep() {
    var t2;
    null == (t2 = this.Lo) || t2.nextStep();
  }
  previousStep() {
    var t2;
    null == (t2 = this.Lo) || t2.previousStep();
  }
  clearCache() {
    var t2;
    this.Fo = null, null == (t2 = this.ni) || t2.unregister(wi);
  }
  resetTour(t2) {
    var e2;
    null == (e2 = this.Lo) || e2.resetTour(t2);
  }
  resetAllTours() {
    var t2;
    null == (t2 = this.Lo) || t2.resetAllTours();
  }
  cancelPendingTour(t2) {
    var e2;
    null == (e2 = this.Lo) || e2.cancelPendingTour(t2);
  }
} }, $a), Oa = { siteApps: class {
  constructor(t2) {
    this._instance = t2, this.No = [], this.apps = {};
  }
  get isEnabled() {
    return !!this._instance.config.opt_in_site_apps;
  }
  $o(t2, e2) {
    if (e2) {
      var i2 = this.globalsForEvent(e2);
      this.No.push(i2), this.No.length > 1e3 && (this.No = this.No.slice(10));
    }
  }
  get siteAppLoaders() {
    var t2;
    return null == (t2 = h._POSTHOG_REMOTE_CONFIG) || null == (t2 = t2[this._instance.config.token]) ? void 0 : t2.siteApps;
  }
  initialize() {
    if (this.isEnabled) {
      var t2 = this._instance._addCaptureHook(this.$o.bind(this));
      this.Do = () => {
        t2(), this.No = [], this.Do = void 0;
      };
    }
  }
  globalsForEvent(t2) {
    var e2, i2, r2, s2, n2, o2, a2;
    if (!t2) throw new Error("Event payload is required");
    var l2 = {}, u2 = this._instance.get_property("$groups") || [], h2 = this._instance.get_property("$stored_group_properties") || {};
    for (var [d2, v2] of Object.entries(h2)) l2[d2] = { id: u2[d2], type: d2, properties: v2 };
    var { $set_once: c2, $set: p2 } = t2;
    return { event: f({}, _(t2, ia), { properties: f({}, t2.properties, p2 ? { $set: f({}, null !== (e2 = null == (i2 = t2.properties) ? void 0 : i2.$set) && void 0 !== e2 ? e2 : {}, p2) } : {}, c2 ? { $set_once: f({}, null !== (r2 = null == (s2 = t2.properties) ? void 0 : s2.$set_once) && void 0 !== r2 ? r2 : {}, c2) } : {}), elements_chain: null !== (n2 = null == (o2 = t2.properties) ? void 0 : o2.$elements_chain) && void 0 !== n2 ? n2 : "", distinct_id: null == (a2 = t2.properties) ? void 0 : a2.distinct_id }), person: { properties: this._instance.get_property("$stored_person_properties") }, groups: l2 };
  }
  setupSiteApp(t2) {
    var e2 = this.apps[t2.id], i2 = () => {
      var i3;
      !e2.errored && this.No.length && (ra.info("Processing " + this.No.length + " events for site app with id " + t2.id), this.No.forEach(((t3) => null == e2.processEvent ? void 0 : e2.processEvent(t3))), e2.processedBuffer = true), Object.values(this.apps).every(((t3) => t3.processedBuffer || t3.errored)) && (null == (i3 = this.Do) || i3.call(this));
    }, r2 = false, s2 = (s3) => {
      e2.errored = !s3, e2.loaded = true, ra.info("Site app with id " + t2.id + " " + (s3 ? "loaded" : "errored")), r2 && i2();
    };
    try {
      var { processEvent: n2 } = t2.init({ posthog: this._instance, callback(t3) {
        s2(t3);
      } });
      n2 && (e2.processEvent = n2), r2 = true;
    } catch (e3) {
      ra.error(sa + t2.id, e3), s2(false);
    }
    if (r2 && e2.loaded) try {
      i2();
    } catch (i3) {
      ra.error("Error while processing buffered events PostHog app with config id " + t2.id, i3), e2.errored = true;
    }
  }
  qo() {
    var t2 = this.siteAppLoaders || [];
    for (var e2 of t2) this.apps[e2.id] = { id: e2.id, loaded: false, errored: false, processedBuffer: false };
    for (var i2 of t2) this.setupSiteApp(i2);
  }
  jo(t2) {
    if (0 !== Object.keys(this.apps).length) {
      var e2 = this.globalsForEvent(t2);
      for (var i2 of Object.values(this.apps)) try {
        null == i2.processEvent || i2.processEvent(e2);
      } catch (e3) {
        ra.error("Error while processing event " + t2.event + " for site app " + i2.id, e3);
      }
    }
  }
  onRemoteConfig(t2) {
    var e2, i2, r2, s2 = this;
    if (null != (e2 = this.siteAppLoaders) && e2.length) return this.isEnabled ? (this.qo(), void this._instance.on("eventCaptured", ((t3) => this.jo(t3)))) : void ra.error('PostHog site apps are disabled. Enable the "opt_in_site_apps" config to proceed.');
    if (null == (i2 = this.Do) || i2.call(this), null != (r2 = t2.siteApps) && r2.length) if (this.isEnabled) {
      var n2 = function(t3) {
        var e3;
        h["__$$ph_site_app_" + t3] = s2._instance, null == (e3 = h.__PosthogExtensions__) || null == e3.loadSiteApp || e3.loadSiteApp(s2._instance, a2, ((e4) => {
          if (e4) return ra.error(sa + t3, e4);
        }));
      };
      for (var { id: o2, url: a2 } of t2.siteApps) n2(o2);
    } else ra.error('PostHog site apps are disabled. Enable the "opt_in_site_apps" config to proceed.');
  }
} }, Ia = { tracingHeaders: class {
  constructor(t2) {
    this.Ho = void 0, this.Uo = void 0, this.ho = () => {
      var t3, e2, i2 = this.Bo() || [];
      N(this.Ho) && (null == (t3 = h.__PosthogExtensions__) || null == (t3 = t3.tracingHeadersPatchFns) || t3._patchXHR(i2, this._instance.get_distinct_id(), this._instance.sessionManager)), N(this.Uo) && (null == (e2 = h.__PosthogExtensions__) || null == (e2 = e2.tracingHeadersPatchFns) || e2._patchFetch(i2, this._instance.get_distinct_id(), this._instance.sessionManager));
    }, this._instance = t2;
  }
  initialize() {
    this.startIfEnabledOrStop();
  }
  lr(t2) {
    var e2, i2;
    null != (e2 = h.__PosthogExtensions__) && e2.tracingHeadersPatchFns && t2(), null == (i2 = h.__PosthogExtensions__) || null == i2.loadExternalDependency || i2.loadExternalDependency(this._instance, "tracing-headers", ((e3) => {
      if (e3) return qo.error("failed to load script", e3);
      t2();
    }));
  }
  Bo() {
    var t2;
    return null !== (t2 = this._instance.config.addTracingHeaders) && void 0 !== t2 ? t2 : this._instance.config.__add_tracing_headers;
  }
  startIfEnabledOrStop() {
    var t2, e2;
    this.Bo() ? this.lr(this.ho) : (null == (t2 = this.Ho) || t2.call(this), null == (e2 = this.Uo) || e2.call(this), this.Ho = void 0, this.Uo = void 0);
  }
} }, Ca = f({ surveys: class {
  get qt() {
    return this._instance.config;
  }
  constructor(t2) {
    this.zo = void 0, this._surveyManager = null, this.Vo = false, this.Wo = [], this.Zo = null, this._instance = t2, this._surveyEventReceiver = null;
  }
  initialize() {
    this.loadIfEnabled();
  }
  onRemoteConfig(t2) {
    if (!this.qt.disable_surveys) {
      var e2 = t2.surveys;
      if (H(e2)) return An.warn("Flags not loaded yet. Not loading surveys.");
      var i2 = M(e2);
      this.zo = i2 ? e2.length > 0 : e2, An.info("flags response received, isSurveysEnabled: " + this.zo), this.loadIfEnabled();
    }
  }
  reset() {
    localStorage.removeItem("lastSeenSurveyDate");
    for (var t2 = [], e2 = 0; e2 < localStorage.length; e2++) {
      var i2 = localStorage.key(e2);
      (null != i2 && i2.startsWith(Fn) || null != i2 && i2.startsWith("inProgressSurvey_")) && t2.push(i2);
    }
    t2.forEach(((t3) => localStorage.removeItem(t3)));
  }
  loadIfEnabled() {
    if (!this._surveyManager) if (this.Vo) An.info("Already initializing surveys, skipping...");
    else if (this.qt.disable_surveys) An.info(ha);
    else if (this.qt.cookieless_mode && this._instance.consent.isOptedOut()) An.info("Not loading surveys in cookieless mode without consent.");
    else {
      var t2 = null == h ? void 0 : h.__PosthogExtensions__;
      if (t2) {
        if (!N(this.zo) || this.qt.advanced_enable_surveys) {
          var e2 = this.zo || this.qt.advanced_enable_surveys;
          this.Vo = true;
          try {
            var i2 = t2.generateSurveys;
            if (i2) return void this.Go(i2, e2);
            var r2 = t2.loadExternalDependency;
            if (!r2) return void this.Qo(Li);
            r2(this._instance, "surveys", ((i3) => {
              i3 || !t2.generateSurveys ? this.Qo("Could not load surveys script", i3) : this.Go(t2.generateSurveys, e2);
            }));
          } catch (t3) {
            throw this.Qo("Error initializing surveys", t3), t3;
          } finally {
            this.Vo = false;
          }
        }
      } else An.error("PostHog Extensions not found.");
    }
  }
  Go(t2, e2) {
    this._surveyManager = t2(this._instance, e2), this._surveyEventReceiver = new la(this._instance), An.info("Surveys loaded successfully"), this.Jo({ isLoaded: true });
  }
  Qo(t2, e2) {
    An.error(t2, e2), this.Jo({ isLoaded: false, error: t2 });
  }
  onSurveysLoaded(t2) {
    return this.Wo.push(t2), this._surveyManager && this.Jo({ isLoaded: true }), () => {
      this.Wo = this.Wo.filter(((e2) => e2 !== t2));
    };
  }
  getSurveys(t2, e2) {
    if (void 0 === e2 && (e2 = false), this.qt.disable_surveys) return An.info(ha), t2([]);
    var i2, r2 = this._instance.get_property(bi);
    if (r2 && !e2) return t2(r2, { isLoaded: true });
    "undefined" != typeof Promise && this.Zo ? this.Zo.then(((e3) => {
      var { surveys: i3, context: r3 } = e3;
      return t2(i3, r3);
    })) : ("undefined" != typeof Promise && (this.Zo = new Promise(((t3) => {
      i2 = t3;
    }))), this._instance._send_request({ url: this._instance.requestRouter.endpointFor("api", "/api/surveys/?token=" + this.qt.token), method: "GET", timeout: this.qt.surveys_request_timeout_ms, callback: (e3) => {
      var r3;
      this.Zo = null;
      var s2 = e3.statusCode;
      if (200 !== s2 || !e3.json) {
        var n2 = "Surveys API could not be loaded, status: " + s2;
        An.error(n2);
        var o2 = { isLoaded: false, error: n2 };
        return t2([], o2), void (null == i2 || i2({ surveys: [], context: o2 }));
      }
      var a2, l2 = e3.json.surveys || [], u2 = l2.filter(((t3) => (function(t4) {
        return !(!t4.start_date || t4.end_date);
      })(t3) && ((function(t4) {
        var e4;
        return !(null == (e4 = t4.conditions) || null == (e4 = e4.events) || null == (e4 = e4.values) || !e4.length);
      })(t3) || (function(t4) {
        var e4;
        return !(null == (e4 = t4.conditions) || null == (e4 = e4.actions) || null == (e4 = e4.values) || !e4.length);
      })(t3))));
      u2.length > 0 && (null == (a2 = this._surveyEventReceiver) || a2.register(u2)), null == (r3 = this._instance.persistence) || r3.register({ [bi]: l2 });
      var h2 = { isLoaded: true };
      t2(l2, h2), null == i2 || i2({ surveys: l2, context: h2 });
    } }));
  }
  Jo(t2) {
    for (var e2 of this.Wo) try {
      if (!t2.isLoaded) return e2([], t2);
      this.getSurveys(e2);
    } catch (t3) {
      An.error("Error in survey callback", t3);
    }
  }
  getActiveMatchingSurveys(t2, e2) {
    if (void 0 === e2 && (e2 = false), !H(this._surveyManager)) return this._surveyManager.getActiveMatchingSurveys(t2, e2);
    An.warn("init was not called");
  }
  Ko(t2) {
    var e2 = null;
    return this.getSurveys(((i2) => {
      var r2;
      e2 = null !== (r2 = i2.find(((e3) => e3.id === t2))) && void 0 !== r2 ? r2 : null;
    })), e2;
  }
  Yo(t2) {
    if (H(this._surveyManager)) return { eligible: false, reason: ua };
    var e2 = "string" == typeof t2 ? this.Ko(t2) : t2;
    return e2 ? this._surveyManager.checkSurveyEligibility(e2) : { eligible: false, reason: "Survey not found" };
  }
  canRenderSurvey(t2) {
    if (H(this._surveyManager)) return An.warn("init was not called"), { visible: false, disabledReason: ua };
    var e2 = this.Yo(t2);
    return { visible: e2.eligible, disabledReason: e2.reason };
  }
  canRenderSurveyAsync(t2, e2) {
    return H(this._surveyManager) ? (An.warn("init was not called"), Promise.resolve({ visible: false, disabledReason: ua })) : new Promise(((i2) => {
      this.getSurveys(((e3) => {
        var r2, s2 = null !== (r2 = e3.find(((e4) => e4.id === t2))) && void 0 !== r2 ? r2 : null;
        if (s2) {
          var n2 = this.Yo(s2);
          i2({ visible: n2.eligible, disabledReason: n2.reason });
        } else i2({ visible: false, disabledReason: "Survey not found" });
      }), e2);
    }));
  }
  renderSurvey(t2, e2, i2) {
    var s2;
    if (H(this._surveyManager)) An.warn("init was not called");
    else {
      var n2 = "string" == typeof t2 ? this.Ko(t2) : t2;
      if (null != n2 && n2.id) if (Mn.includes(n2.type)) {
        var o2 = null == r ? void 0 : r.querySelector(e2);
        if (o2) return null != (s2 = n2.appearance) && s2.surveyPopupDelaySeconds ? (An.info("Rendering survey " + n2.id + " with delay of " + n2.appearance.surveyPopupDelaySeconds + " seconds"), void setTimeout((() => {
          var t3, e3;
          An.info("Rendering survey " + n2.id + " with delay of " + (null == (t3 = n2.appearance) ? void 0 : t3.surveyPopupDelaySeconds) + " seconds"), null == (e3 = this._surveyManager) || e3.renderSurvey(n2, o2, i2), An.info("Survey " + n2.id + " rendered");
        }), 1e3 * n2.appearance.surveyPopupDelaySeconds)) : void this._surveyManager.renderSurvey(n2, o2, i2);
        An.warn("Survey element not found");
      } else An.warn("Surveys of type " + n2.type + " cannot be rendered in the app");
      else An.warn("Survey not found");
    }
  }
  displaySurvey(t2, e2) {
    var i2;
    if (H(this._surveyManager)) An.warn("init was not called");
    else {
      var r2 = this.Ko(t2);
      if (r2) {
        var s2 = r2;
        if (null != (i2 = r2.appearance) && i2.surveyPopupDelaySeconds && e2.ignoreDelay && (s2 = f({}, r2, { appearance: f({}, r2.appearance, { surveyPopupDelaySeconds: 0 }) })), e2.displayType !== cs.Popover && e2.initialResponses && An.warn("initialResponses is only supported for popover surveys. prefill will not be applied."), false === e2.ignoreConditions) {
          var n2 = this.canRenderSurvey(r2);
          if (!n2.visible) return void An.warn("Survey is not eligible to be displayed: ", n2.disabledReason);
        }
        e2.displayType !== cs.Inline ? this._surveyManager.handlePopoverSurvey(s2, e2) : this.renderSurvey(s2, e2.selector, e2.properties);
      } else An.warn("Survey not found");
    }
  }
  cancelPendingSurvey(t2) {
    H(this._surveyManager) ? An.warn("init was not called") : this._surveyManager.cancelSurvey(t2);
  }
  handlePageUnload() {
    var t2;
    null == (t2 = this._surveyManager) || t2.handlePageUnload();
  }
} }, $a), Aa = { toolbar: class {
  constructor(t2) {
    this.instance = t2;
  }
  Xo(t2) {
    h.ph_toolbar_state = t2;
  }
  ta() {
    var t2;
    return null !== (t2 = h.ph_toolbar_state) && void 0 !== t2 ? t2 : 0;
  }
  initialize() {
    return this.maybeLoadToolbar();
  }
  maybeLoadToolbar(e2, i2, s2) {
    if (void 0 === e2 && (e2 = void 0), void 0 === i2 && (i2 = void 0), void 0 === s2 && (s2 = void 0), or(this.instance.config)) return false;
    if (!t || !r) return false;
    e2 = null != e2 ? e2 : t.location, s2 = null != s2 ? s2 : t.history;
    try {
      if (!i2) {
        try {
          t.localStorage.setItem("test", "test"), t.localStorage.removeItem("test");
        } catch (t2) {
          return false;
        }
        i2 = null == t ? void 0 : t.localStorage;
      }
      var n2, o2 = da || Nr(e2.hash, "__posthog") || Nr(e2.hash, "state"), a2 = o2 ? tr((() => JSON.parse(atob(decodeURIComponent(o2))))) || tr((() => JSON.parse(decodeURIComponent(o2)))) : null;
      return a2 && "ph_authorize" === a2.action ? ((n2 = a2).source = "url", n2 && Object.keys(n2).length > 0 && (a2.desiredHash ? e2.hash = a2.desiredHash : s2 ? s2.replaceState(s2.state, "", e2.pathname + e2.search) : e2.hash = "")) : ((n2 = JSON.parse(i2.getItem(va) || "{}")).source = "localstorage", delete n2.userIntent), !(!n2.token || this.instance.config.token !== n2.token || (this.loadToolbar(n2), 0));
    } catch (t2) {
      return false;
    }
  }
  ea(t2) {
    var e2 = h.ph_load_toolbar || h.ph_load_editor;
    !H(e2) && D(e2) ? e2(t2, this.instance) : ca.warn("No toolbar load function found");
  }
  loadToolbar(e2) {
    var i2 = !(null == r || !r.getElementById(Ai));
    if (!t || i2) return false;
    var s2 = "custom" === this.instance.requestRouter.region && this.instance.config.advanced_disable_toolbar_metrics, n2 = f({ token: this.instance.config.token }, e2, { apiURL: this.instance.requestRouter.endpointFor("ui") }, s2 ? { instrument: false } : {});
    if (t.localStorage.setItem(va, JSON.stringify(f({}, n2, { source: void 0 }))), 2 === this.ta()) this.ea(n2);
    else if (0 === this.ta()) {
      var o2;
      this.Xo(1), null == (o2 = h.__PosthogExtensions__) || null == o2.loadExternalDependency || o2.loadExternalDependency(this.instance, "toolbar", ((t2) => {
        if (t2) return ca.error("[Toolbar] Failed to load", t2), void this.Xo(0);
        this.Xo(2), this.ea(n2);
      })), nr(t, "turbolinks:load", (() => {
        this.Xo(0), this.loadToolbar(n2);
      }));
    }
    return true;
  }
  ra(t2) {
    return this.loadToolbar(t2);
  }
  maybeLoadEditor(t2, e2, i2) {
    return void 0 === t2 && (t2 = void 0), void 0 === e2 && (e2 = void 0), void 0 === i2 && (i2 = void 0), this.maybeLoadToolbar(t2, e2, i2);
  }
} }, Fa = f({ experiments: xa }, $a), Ma = { conversations: class {
  constructor(t2) {
    this.ia = void 0, this._conversationsManager = null, this.na = false, this.sa = null, this._instance = t2;
  }
  initialize() {
    this.loadIfEnabled();
  }
  onRemoteConfig(t2) {
    if (!this._instance.config.disable_conversations) {
      var e2 = t2.conversations;
      H(e2) || (W(e2) ? this.ia = e2 : (this.ia = e2.enabled, this.sa = e2), this.loadIfEnabled());
    }
  }
  reset() {
    var t2;
    null == (t2 = this._conversationsManager) || t2.reset(), this._conversationsManager = null, this.ia = void 0, this.sa = null;
  }
  loadIfEnabled() {
    if (!(this._conversationsManager || this.na || this._instance.config.disable_conversations || or(this._instance.config) || this._instance.config.cookieless_mode && this._instance.consent.isOptedOut())) {
      var t2 = null == h ? void 0 : h.__PosthogExtensions__;
      if (t2 && !N(this.ia) && this.ia) if (this.sa && this.sa.token) {
        this.na = true;
        try {
          var e2 = t2.initConversations;
          if (e2) return this.oa(e2), void (this.na = false);
          var i2 = t2.loadExternalDependency;
          if (!i2) return void this.aa(Li);
          i2(this._instance, "conversations", ((e3) => {
            e3 || !t2.initConversations ? this.aa("Could not load conversations script", e3) : this.oa(t2.initConversations), this.na = false;
          }));
        } catch (t3) {
          this.aa("Error initializing conversations", t3), this.na = false;
        }
      } else Ea.error("Conversations enabled but missing token in remote config.");
    }
  }
  oa(t2) {
    if (this.sa) try {
      this._conversationsManager = t2(this.sa, this._instance), Ea.info("Conversations loaded successfully");
    } catch (t3) {
      this.aa("Error completing conversations initialization", t3);
    }
    else Ea.error("Cannot complete initialization: remote config is null");
  }
  aa(t2, e2) {
    Ea.error(t2, e2), this._conversationsManager = null, this.na = false;
  }
  show() {
    this._conversationsManager ? this._conversationsManager.show() : Ea.warn("Conversations not loaded yet.");
  }
  hide() {
    this._conversationsManager && this._conversationsManager.hide();
  }
  isAvailable() {
    return true === this.ia && !B(this._conversationsManager);
  }
  isVisible() {
    var t2, e2;
    return null !== (t2 = null == (e2 = this._conversationsManager) ? void 0 : e2.isVisible()) && void 0 !== t2 && t2;
  }
  sendMessage(t2, e2, i2) {
    var r2 = this;
    return p((function* () {
      return r2._conversationsManager ? r2._conversationsManager.sendMessage(t2, e2, i2) : (Ea.warn(Sa), null);
    }))();
  }
  getMessages(t2, e2) {
    var i2 = this;
    return p((function* () {
      return i2._conversationsManager ? i2._conversationsManager.getMessages(t2, e2) : (Ea.warn(Sa), null);
    }))();
  }
  markAsRead(t2) {
    var e2 = this;
    return p((function* () {
      return e2._conversationsManager ? e2._conversationsManager.markAsRead(t2) : (Ea.warn(Sa), null);
    }))();
  }
  getTickets(t2) {
    var e2 = this;
    return p((function* () {
      return e2._conversationsManager ? e2._conversationsManager.getTickets(t2) : (Ea.warn(Sa), null);
    }))();
  }
  requestRestoreLink(t2) {
    var e2 = this;
    return p((function* () {
      return e2._conversationsManager ? e2._conversationsManager.requestRestoreLink(t2) : (Ea.warn(Sa), null);
    }))();
  }
  restoreFromToken(t2) {
    var e2 = this;
    return p((function* () {
      return e2._conversationsManager ? e2._conversationsManager.restoreFromToken(t2) : (Ea.warn(Sa), null);
    }))();
  }
  restoreFromUrlToken() {
    var t2 = this;
    return p((function* () {
      return t2._conversationsManager ? t2._conversationsManager.restoreFromUrlToken() : (Ea.warn(Sa), null);
    }))();
  }
  getCurrentTicketId() {
    var t2, e2;
    return null !== (t2 = null == (e2 = this._conversationsManager) ? void 0 : e2.getCurrentTicketId()) && void 0 !== t2 ? t2 : null;
  }
  getWidgetSessionId() {
    var t2, e2;
    return null !== (t2 = null == (e2 = this._conversationsManager) ? void 0 : e2.getWidgetSessionId()) && void 0 !== t2 ? t2 : null;
  }
  vn() {
    var t2;
    null == (t2 = this._conversationsManager) || t2.setIdentity();
  }
  fn() {
    var t2;
    null == (t2 = this._conversationsManager) || t2.clearIdentity();
  }
} }, Da = { logs: class {
  constructor(t2) {
    var e2;
    this.ua = false, this.la = false, this.Gt = je("[logs]"), this.ha = [], this.ca = 0, this.da = 0, this.va = false, this._instance = t2, this._instance && null != (e2 = this._instance.config.logs) && e2.captureConsoleLogs && (this.ua = true);
  }
  initialize() {
    this.loadIfEnabled();
  }
  onRemoteConfig(t2) {
    var e2, i2 = null == (e2 = t2.logs) ? void 0 : e2.captureConsoleLogs;
    !H(i2) && i2 && (this.ua = true, this.loadIfEnabled());
  }
  reset() {
    this.ha = [], this.qr && (clearTimeout(this.qr), this.qr = void 0), this.ca = 0, this.da = 0, this.va = false;
  }
  loadIfEnabled() {
    if (this.ua && !this.la) {
      var t2 = null == h ? void 0 : h.__PosthogExtensions__;
      if (t2) {
        var e2 = t2.loadExternalDependency;
        e2 ? e2(this._instance, "logs", ((e3) => {
          var i2;
          e3 || null == (i2 = t2.logs) || !i2.initializeLogs ? this.Gt.error("Could not load logs script", e3) : (t2.logs.initializeLogs(this._instance), this.la = true);
        })) : this.Gt.error(Li);
      } else this.Gt.error("PostHog Extensions not found.");
    }
  }
  captureLog(t2) {
    var e2, i2, r2, s2, n2, o2;
    if (this._instance.is_capturing()) if (t2 && t2.body) {
      var a2 = null !== (e2 = null == (i2 = this._instance.config.logs) ? void 0 : i2.flushIntervalMs) && void 0 !== e2 ? e2 : 3e3, l2 = null !== (r2 = null == (s2 = this._instance.config.logs) ? void 0 : s2.maxLogsPerInterval) && void 0 !== r2 ? r2 : 1e3, u2 = Date.now();
      if (a2 > u2 - this.da || (this.da = u2, this.ca = 0, this.va = false), l2 > this.ca) {
        this.ca++;
        var h2 = (function(t3, e3) {
          var i3 = t3.level || "info", { text: r3, number: s3 } = re[i3] || se, n3 = String(Date.now()) + "000000", o3 = {};
          e3.distinctId && (o3.posthogDistinctId = e3.distinctId), e3.sessionId && (o3.sessionId = e3.sessionId), e3.currentUrl && (o3["url.full"] = e3.currentUrl), e3.screenName && (o3["screen.name"] = e3.screenName), e3.appState && (o3["app.state"] = e3.appState), e3.activeFeatureFlags && e3.activeFeatureFlags.length > 0 && (o3.feature_flags = e3.activeFeatureFlags);
          var a3 = f({}, o3, t3.attributes || {}), l3 = { timeUnixNano: n3, observedTimeUnixNano: n3, severityNumber: s3, severityText: r3, body: { stringValue: t3.body }, attributes: oe(a3) };
          return t3.trace_id && (l3.traceId = t3.trace_id), t3.span_id && (l3.spanId = t3.span_id), N(t3.trace_flags) || (l3.flags = t3.trace_flags), l3;
        })(t2, this.fa());
        this.ha.push({ record: h2 }), (null !== (n2 = null == (o2 = this._instance.config.logs) ? void 0 : o2.maxBufferSize) && void 0 !== n2 ? n2 : 100) > this.ha.length ? this.pa() : this.flushLogs();
      } else this.va || (this.Gt.warn("captureLog dropping logs: exceeded " + l2 + " logs per " + a2 + "ms"), this.va = true);
    } else this.Gt.warn("captureLog requires a body");
  }
  get logger() {
    return this.ga || (this.ga = { trace: (t2, e2) => this.captureLog({ body: t2, level: "trace", attributes: e2 }), debug: (t2, e2) => this.captureLog({ body: t2, level: "debug", attributes: e2 }), info: (t2, e2) => this.captureLog({ body: t2, level: "info", attributes: e2 }), warn: (t2, e2) => this.captureLog({ body: t2, level: "warn", attributes: e2 }), error: (t2, e2) => this.captureLog({ body: t2, level: "error", attributes: e2 }), fatal: (t2, e2) => this.captureLog({ body: t2, level: "fatal", attributes: e2 }) }), this.ga;
  }
  flushLogs(t2) {
    if (this.qr && (clearTimeout(this.qr), this.qr = void 0), 0 !== this.ha.length) {
      var e2 = this.ha;
      this.ha = [];
      var i2 = this._instance.config.logs, r2 = f({ "service.name": (null == i2 ? void 0 : i2.serviceName) || "unknown_service" }, (null == i2 ? void 0 : i2.environment) && { "deployment.environment": i2.environment }, (null == i2 ? void 0 : i2.serviceVersion) && { "service.version": i2.serviceVersion }, null == i2 ? void 0 : i2.resourceAttributes), s2 = (function(t3, e3, i3, r3) {
        return { resourceLogs: [{ resource: { attributes: oe(e3) }, scopeLogs: [{ scope: { name: i3, version: r3 }, logRecords: t3 }] }] };
      })(e2.map(((t3) => t3.record)), r2, v.LIB_NAME, v.LIB_VERSION), n2 = this._instance.requestRouter.endpointFor("api", "/i/v1/logs") + "?token=" + encodeURIComponent(this._instance.config.token);
      this._instance.Zi({ method: "POST", url: n2, data: s2, compression: "best-available", batchKey: "logs", transport: t2 });
    }
  }
  pa() {
    var t2, e2;
    this.qr || (this.qr = setTimeout((() => {
      this.qr = void 0, this.flushLogs();
    }), null !== (t2 = null == (e2 = this._instance.config.logs) ? void 0 : e2.flushIntervalMs) && void 0 !== t2 ? t2 : 3e3));
  }
  fa() {
    var t2, e2 = {};
    if (e2.distinctId = this._instance.get_distinct_id(), this._instance.sessionManager) {
      var { sessionId: i2 } = this._instance.sessionManager.checkAndGetSessionAndWindowId(true);
      e2.sessionId = i2;
    }
    if (null != h && null != (t2 = h.location) && t2.href && (e2.currentUrl = h.location.href), this._instance.featureFlags) {
      var r2 = this._instance.featureFlags.getFlags();
      r2 && r2.length > 0 && (e2.activeFeatureFlags = r2);
    }
    return e2;
  }
} }, Ua = f({}, $a, Ta, ka, Ra, Pa, Oa, Ca, Ia, Aa, Fa, Ma, Da);
to.__defaultExtensionClasses = f({}, Ua);
var La, Na = (La = zn[Yn] = new to(), (function() {
  function e2() {
    e2.done || (e2.done = true, Jn = false, Xi(zn, (function(t2) {
      t2._dom_loaded();
    })));
  }
  null != r && r.addEventListener ? "complete" === r.readyState ? e2() : nr(r, "DOMContentLoaded", e2, { capture: false }) : t && Ne.error("Browser doesn't support `document.addEventListener` so PostHog couldn't be initialized");
})(), La);
let initialized = false;
function initAnalytics() {
  if (initialized) return;
  if (typeof window === "undefined") return;
  const key = "phc_ofxqGBqsLUStHS9St3RF4nXALbc6jwHeVH8FNXE8TG54";
  Na.init(key, {
    api_host: "https://us.i.posthog.com",
    capture_pageview: false,
    // 手动控制，配合路由
    capture_pageleave: true,
    persistence: "localStorage+cookie",
    autocapture: false,
    disable_session_recording: false
  });
  initialized = true;
}
function trackPageview(path) {
  if (!initialized) return;
  Na.capture("$pageview", { $current_url: window.location.href, path });
}
function track(event, props) {
  if (!initialized) return;
  Na.capture(event, props);
}
function identifyUser(userId, traits) {
  if (!initialized) return;
  Na.identify(userId, traits);
}
function resetAnalytics() {
  if (!initialized) return;
  Na.reset();
}
const Events = {
  // 账户
  SignUp: "auth_sign_up",
  SignIn: "auth_sign_in",
  SignOut: "auth_sign_out",
  // 核心互动
  PostCreated: "post_created",
  PostLiked: "post_liked",
  CommentCreated: "comment_created",
  ChatMessageSent: "chat_message_sent",
  VideoUploaded: "video_uploaded",
  ProfileViewed: "profile_viewed",
  MatchSwipe: "match_swipe",
  // 变现漏斗
  WalletViewed: "wallet_viewed",
  TopupStarted: "topup_started",
  TopupSucceeded: "topup_succeeded",
  TopupFailed: "topup_failed",
  PaidFeatureUnlocked: "paid_feature_unlocked",
  // 管理员
  AdminActionPerformed: "admin_action_performed"
};
const analytics = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Events,
  identifyUser,
  initAnalytics,
  resetAnalytics,
  track,
  trackPageview
}, Symbol.toStringTag, { value: "Module" }));
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
const __iconNode$9 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$9);
const __iconNode$8 = [
  ["path", { d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", key: "jecpp" }],
  ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2", key: "i6l2r4" }]
];
const Briefcase = createLucideIcon("briefcase", __iconNode$8);
const __iconNode$7 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
];
const CalendarDays = createLucideIcon("calendar-days", __iconNode$7);
const __iconNode$6 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$6);
const __iconNode$5 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$5);
const __iconNode$4 = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
];
const LayoutGrid = createLucideIcon("layout-grid", __iconNode$4);
const __iconNode$3 = [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      key: "kfwtm"
    }
  ]
];
const Moon = createLucideIcon("moon", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M16.247 7.761a6 6 0 0 1 0 8.478", key: "1fwjs5" }],
  ["path", { d: "M19.075 4.933a10 10 0 0 1 0 14.134", key: "ehdyv1" }],
  ["path", { d: "M4.925 19.067a10 10 0 0 1 0-14.134", key: "1q22gi" }],
  ["path", { d: "M7.753 16.239a6 6 0 0 1 0-8.478", key: "r2q7qm" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
];
const Radio = createLucideIcon("radio", __iconNode$2);
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
];
const Sun = createLucideIcon("sun", __iconNode$1);
const __iconNode = [
  ["path", { d: "M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978", key: "1n3hpd" }],
  ["path", { d: "M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978", key: "rfe1zi" }],
  ["path", { d: "M18 9h1.5a1 1 0 0 0 0-5H18", key: "7xy6bh" }],
  ["path", { d: "M4 22h16", key: "57wxv0" }],
  ["path", { d: "M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z", key: "1mhfuq" }],
  ["path", { d: "M6 9H4.5a1 1 0 0 1 0-5H6", key: "tex48p" }]
];
const Trophy = createLucideIcon("trophy", __iconNode);
const HIDDEN_ROUTES = ["/auth", "/onboarding", "/admin"];
const ITEMS = [
  { to: "/contests", label: "比赛公告", icon: Trophy, hue: "from-coral to-sun" },
  { to: "/jobs", label: "实习与工作", icon: Briefcase, hue: "from-mint to-brand" },
  { to: "/venues", label: "场地预约", icon: CalendarDays, hue: "from-sun to-coral" },
  { to: "/radar", label: "附近的人", icon: Radio, hue: "from-mint to-sun" }
];
function SideRail() {
  const path = useRouterState({ select: (s2) => s2.location.pathname });
  const [open, setOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setOpen(false);
  }, [path]);
  if (HIDDEN_ROUTES.some((p2) => path.startsWith(p2))) return null;
  if (path === "/" || path === "") return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setOpen(true),
        "aria-label": "打开功能栏",
        className: `fixed left-0 top-1/2 z-30 -translate-y-1/2 ${open ? "pointer-events-none opacity-0" : "opacity-100"} transition-opacity duration-200`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 rounded-r-2xl border border-l-0 border-border bg-gradient-to-br from-coral/90 to-sun/90 py-3 pl-1.5 pr-2 text-background shadow-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "h-4 w-4" })
        ] })
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        "aria-label": "关闭",
        onClick: () => setOpen(false),
        className: "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "aside",
      {
        className: `fixed left-0 top-0 z-50 h-full w-72 max-w-[82vw] transform border-r border-border bg-background/95 backdrop-blur-2xl shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`,
        role: "dialog",
        "aria-hidden": !open,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-32 overflow-hidden bg-gradient-to-br from-coral via-sun/80 to-mint/70", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-8 -top-8 h-32 w-32 rounded-full bg-background/20 blur-2xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-semibold text-background", children: "Pulse 校园" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-background/80", children: "让校园生活更高效一些 ✨" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setOpen(false),
                className: "absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/30 text-background",
                "aria-label": "收起",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-col gap-1 overflow-y-auto p-3", children: ITEMS.map((it2) => {
            const active = path.startsWith(it2.to);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: it2.to,
                className: `group flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition ${active ? "border-coral/60 bg-coral/10" : "border-transparent hover:bg-surface/70"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${it2.hue} text-background shadow`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(it2.icon, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `flex-1 text-sm ${active ? "font-semibold text-foreground" : "text-foreground/90"}`, children: it2.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" })
                ]
              },
              it2.to
            );
          }) })
        ]
      }
    )
  ] });
}
const PRIMARY_ROUTES = ["/", "/community", "/explore", "/messages", "/me"];
const HIDE_BACK_PREFIXES = ["/auth", "/onboarding"];
function shouldHideBack(pathname) {
  if (PRIMARY_ROUTES.includes(pathname)) return true;
  return HIDE_BACK_PREFIXES.some((p2) => pathname.startsWith(p2));
}
function GlobalBackButton() {
  const path = useRouterState({ select: (s2) => s2.location.pathname });
  const router2 = useRouter();
  if (shouldHideBack(path)) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: () => {
        if (window.history.length > 1) router2.history.back();
        else router2.navigate({ to: "/" });
      },
      "aria-label": "返回上一页",
      className: "fixed left-3 top-3 z-[60] inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-lg backdrop-blur-xl transition hover:scale-105 active:scale-95",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
    }
  );
}
const THEME_KEY = "pulse-theme";
function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}
function ThemeToggle() {
  const [theme, setTheme] = reactExports.useState("light");
  reactExports.useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: toggle,
      "aria-label": theme === "dark" ? "切换到白昼模式" : "切换到夜间模式",
      title: theme === "dark" ? "白昼模式" : "夜间模式",
      className: "fixed right-3 top-3 z-[60] inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-lg backdrop-blur-xl transition hover:scale-105 active:scale-95",
      children: theme === "dark" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "h-4 w-4" })
    }
  );
}
const appCss = "/assets/styles-hPRQScS-.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$v = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Pulse · 遇见同频的人" },
      { name: "description", content: "Pulse 是为年轻人打造的综合社交平台：滑卡匹配、动态广场、实时聊天，找到真正同频的灵魂。" },
      { name: "author", content: "Pulse" },
      { property: "og:title", content: "Pulse · 遇见同频的人" },
      { property: "og:description", content: "Pulse 是为年轻人打造的综合社交平台：滑卡匹配、动态广场、实时聊天，找到真正同频的灵魂。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Pulse · 遇见同频的人" },
      { name: "twitter:description", content: "Pulse 是为年轻人打造的综合社交平台：滑卡匹配、动态广场、实时聊天，找到真正同频的灵魂。" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$v.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(StaleClientRecovery, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AuthSync, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationsBridge, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnalyticsBridge, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SideRail, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(GlobalBackButton, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { theme: "dark", position: "top-center", richColors: true })
  ] });
}
function StaleClientRecovery() {
  reactExports.useEffect(() => {
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input, init) => {
      const response = await originalFetch(input, init);
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      if (url.includes("/_serverFn/") && response.status === 409) {
        try {
          const payload = await response.clone().json();
          if (payload?.error === "STALE_CLIENT" && !sessionStorage.getItem("pulse-stale-client-refresh")) {
            sessionStorage.setItem("pulse-stale-client-refresh", "1");
            window.location.reload();
          }
        } catch {
        }
      }
      return response;
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
  return null;
}
function AnalyticsBridge() {
  const router2 = useRouter();
  reactExports.useEffect(() => {
    initAnalytics();
    trackPageview(window.location.pathname);
    const unsub = router2.subscribe("onResolved", () => {
      trackPageview(window.location.pathname);
    });
    return () => unsub();
  }, [router2]);
  return null;
}
function NotificationsBridge() {
  useNotificationsRealtime();
  return null;
}
function AuthSync() {
  const router2 = useRouter();
  const queryClient = useQueryClient();
  reactExports.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      router2.invalidate();
      queryClient.invalidateQueries();
      if (session?.user) {
        identifyUser(session.user.id, { email: session.user.email });
      } else if (event === "SIGNED_OUT") {
        resetAnalytics();
      }
    });
    return () => subscription.unsubscribe();
  }, [router2, queryClient]);
  return null;
}
const $$splitComponentImporter$u = () => import("./wallet-Cm7Ma2y6.js");
const Route$u = createFileRoute("/wallet")({
  head: () => ({
    meta: [{
      title: "钱包 · Pulse"
    }, {
      name: "description",
      content: "Pulse 心动币钱包：充值、送礼、订阅 Pulse Pro。"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$u, "component")
});
const $$splitComponentImporter$t = () => import("./voice-card-D5wLj0dP.js");
const Route$t = createFileRoute("/voice-card")({
  head: () => ({
    meta: [{
      title: "语音名片 · Pulse"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$t, "component")
});
const $$splitComponentImporter$s = () => import("./videos-BsDVWBgi.js");
const Route$s = createFileRoute("/videos")({
  head: () => ({
    meta: [{
      title: "短视频 · Pulse"
    }, {
      name: "description",
      content: "在 Pulse 看陌生人的真实生活片段,30 秒读懂一个人。"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const $$splitComponentImporter$r = () => import("./verify-BJcOU7o9.js");
const Route$r = createFileRoute("/verify")({
  head: () => ({
    meta: [{
      title: "实名 & 学生认证 · Pulse"
    }, {
      name: "description",
      content: "提交实名认证或学生认证，获得认证徽章，提升匹配可信度。"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("./venues-DKV3KfWE.js");
const Route$q = createFileRoute("/venues")({
  head: () => ({
    meta: [{
      title: "场地预约 · Pulse"
    }, {
      name: "description",
      content: "图书馆讨论室、剧场、运动场地等校园资源,一键预约。"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("./radar-DWI6Fhi2.js");
const Route$p = createFileRoute("/radar")({
  head: () => ({
    meta: [{
      title: "社交雷达 · Pulse"
    }, {
      name: "description",
      content: "实时感知周边在线用户的分布、活跃度与社交热度。"
    }, {
      property: "og:title",
      content: "社交雷达 · Pulse"
    }, {
      property: "og:description",
      content: "用雷达扫描身边的同频灵魂。"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("./privacy-HQeebsJA.js");
const Route$o = createFileRoute("/privacy")({
  head: () => ({
    meta: [{
      title: "隐私与可见性 · Pulse"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./onboarding-CaaGs5jg.js");
const Route$n = createFileRoute("/onboarding")({
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./notifications-D5zdAO8n.js");
const Route$m = createFileRoute("/notifications")({
  head: () => ({
    meta: [{
      title: "通知 · Pulse"
    }, {
      name: "description",
      content: "你的 Pulse 站内通知：消息、点赞、配对、评论、关注。"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./messages-DRD-9cqs.js");
const Route$l = createFileRoute("/messages")({
  head: () => ({
    meta: [{
      title: "消息 · Pulse"
    }, {
      name: "description",
      content: "你的 Pulse 对话列表：和匹配的人、语音/视频破冰的人继续聊。"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./me-m0C76bQ-.js");
const Route$k = createFileRoute("/me")({
  head: () => ({
    meta: [{
      title: "我的 · Pulse"
    }, {
      name: "description",
      content: "查看与编辑你的 Pulse 个人主页：资料、相册、兴趣标签、认证与设置。"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./jobs-CWaUvMx8.js");
const Route$j = createFileRoute("/jobs")({
  head: () => ({
    meta: [{
      title: "实习与工作 · Pulse"
    }, {
      name: "description",
      content: "校园兼职、实习、项目合作需求集合,快速找到搭子或人才。"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./games-D8j7XAIu.js");
const Route$i = createFileRoute("/games")({
  head: () => ({
    meta: [{
      title: "破冰游戏 · Pulse — 让聊天不再尬聊"
    }, {
      name: "description",
      content: "Pulse 精选社交破冰小游戏：真心话大冒险、心动盲盒、灵魂问答、双人节奏。让每一次相遇都更有趣。"
    }, {
      property: "og:title",
      content: "破冰游戏 · Pulse"
    }, {
      property: "og:description",
      content: "和心动的人一起玩，从一次心跳开始的社交小游戏合集。"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./explore-CJm9fXwl.js");
const Route$h = createFileRoute("/explore")({
  head: () => ({
    meta: [{
      title: "发现 · Pulse"
    }, {
      name: "description",
      content: "社交雷达、语音、视频、匿名树洞——在 Pulse 发现更多可能。"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./discover-ou8wtNRp.js");
const Route$g = createFileRoute("/discover")({
  head: () => ({
    meta: [{
      title: "发现 · Pulse"
    }, {
      name: "description",
      content: "在 Pulse 上滑动卡片，遇见同频的人。"
    }, {
      property: "og:title",
      content: "发现 · Pulse"
    }, {
      property: "og:description",
      content: "滑动卡片，遇见同频的人。"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./contests-DOW8ICm4.js");
const Route$f = createFileRoute("/contests")({
  head: () => ({
    meta: [{
      title: "比赛公告 · Pulse"
    }, {
      name: "description",
      content: "校园比赛、活动、竞赛公告一站浏览,发布属于你的赛事召集令。"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./community-Dm-_Gk8z.js");
const Route$e = createFileRoute("/community")({
  head: () => ({
    meta: [{
      title: "社区广场 · Pulse"
    }, {
      name: "description",
      content: "陵水黎安国际教育创新试验区的同频社区：二手闲置、生活吐槽、发帖求助。"
    }]
  }),
  validateSearch: (s2) => objectType({
    compose: coerce.number().int().min(0).max(1).optional()
  }).parse(s2),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./chat-1x7gHoSW.js");
const Route$d = createFileRoute("/chat")({
  head: () => ({
    meta: [{
      title: "聊天 · Pulse"
    }]
  }),
  validateSearch: (s2) => ({
    conv: typeof s2.conv === "string" ? s2.conv : void 0,
    name: typeof s2.name === "string" ? s2.name : void 0,
    avatar: typeof s2.avatar === "string" ? s2.avatar : void 0,
    from: ["voice", "video", "match", "radar"].includes(s2.from) ? s2.from : void 0,
    age: typeof s2.age === "number" ? s2.age : s2.age ? Number(s2.age) : void 0,
    city: typeof s2.city === "string" ? s2.city : void 0
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./auth-DtAR17DZ.js");
const Route$c = createFileRoute("/auth")({
  validateSearch: (s2) => ({
    mode: s2.mode === "signup" ? "signup" : "login",
    redirect: s2.redirect || "/community"
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./admin-eE7V7SiC.js");
const Route$b = createFileRoute("/admin")({
  head: () => ({
    meta: [{
      title: "员工内部后台 · Pulse"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./add-friend-Aqc1rjdE.js");
const Route$a = createFileRoute("/add-friend")({
  head: () => ({
    meta: [{
      title: "添加好友 · Pulse"
    }]
  }),
  validateSearch: (s2) => ({
    tab: ["search", "qr", "scan"].includes(s2.tab) ? s2.tab : void 0
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./index-C-vTcJ6b.js");
const Route$9 = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({
      to: "/community"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./videos.upload-CzJrO4Pd.js");
const Route$8 = createFileRoute("/videos/upload")({
  head: () => ({
    meta: [{
      title: "发布短视频 · Pulse"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./me.reports-BR-rUVeb.js");
const Route$7 = createFileRoute("/me/reports")({
  head: () => ({
    meta: [{
      title: "我的举报与申诉 · Pulse"
    }, {
      name: "description",
      content: "查看你提交过的举报处理进度,并对处理结果提出申诉。"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./games.sbti-B1Z7yYYp.js");
const Route$6 = createFileRoute("/games/sbti")({
  head: () => ({
    meta: [{
      title: "SBTI 人格测试 · Pulse — 比 MBTI 更损的破冰游戏"
    }, {
      name: "description",
      content: "Pulse 内置 SBTI 娱乐人格测试，30 题测出你的互联网原生人格类型，结果可分享。"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./games.palm-D8-AkTMP.js");
const Route$5 = createFileRoute("/games/palm")({
  head: () => ({
    meta: [{
      title: "AI 看手相 · Pulse — 拍张手掌，读懂你的爱情线"
    }, {
      name: "description",
      content: "上传手掌照片，Pulse AI 解读你的感情线、事业线与生命线，生成专属手相报告。"
    }, {
      property: "og:title",
      content: "AI 看手相 · Pulse"
    }, {
      property: "og:description",
      content: "拍张手掌，AI 为你解读爱情线。"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./games.leaderboard-OsX1HpwS.js");
const Route$4 = createFileRoute("/games/leaderboard")({
  head: () => ({
    meta: [{
      title: "战绩排行榜 · Pulse 游戏"
    }, {
      name: "description",
      content: "查看 Pulse 破冰游戏全服玩家排行榜：心动分数、胜率、连胜与高光时刻一目了然。"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./explore.voice-DegrK8-B.js");
const Route$3 = createFileRoute("/explore/voice")({
  head: () => ({
    meta: [{
      title: "语音聊天 · Pulse"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./explore.video-MBaFDnZv.js");
const Route$2 = createFileRoute("/explore/video")({
  head: () => ({
    meta: [{
      title: "视频聊天 · Pulse"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./explore.treehole-D40Wzocr.js");
const Route$1 = createFileRoute("/explore/treehole")({
  head: () => ({
    meta: [{
      title: "匿名树洞 · Pulse"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./contests._contestId-Doo_MmJ4.js");
const Route2 = createFileRoute("/contests/$contestId")({
  head: () => ({
    meta: [{
      title: "比赛详情 · Pulse"
    }, {
      name: "description",
      content: "查看比赛公告的完整信息与报名方式。"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const WalletRoute = Route$u.update({
  id: "/wallet",
  path: "/wallet",
  getParentRoute: () => Route$v
});
const VoiceCardRoute = Route$t.update({
  id: "/voice-card",
  path: "/voice-card",
  getParentRoute: () => Route$v
});
const VideosRoute = Route$s.update({
  id: "/videos",
  path: "/videos",
  getParentRoute: () => Route$v
});
const VerifyRoute = Route$r.update({
  id: "/verify",
  path: "/verify",
  getParentRoute: () => Route$v
});
const VenuesRoute = Route$q.update({
  id: "/venues",
  path: "/venues",
  getParentRoute: () => Route$v
});
const RadarRoute = Route$p.update({
  id: "/radar",
  path: "/radar",
  getParentRoute: () => Route$v
});
const PrivacyRoute = Route$o.update({
  id: "/privacy",
  path: "/privacy",
  getParentRoute: () => Route$v
});
const OnboardingRoute = Route$n.update({
  id: "/onboarding",
  path: "/onboarding",
  getParentRoute: () => Route$v
});
const NotificationsRoute = Route$m.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => Route$v
});
const MessagesRoute = Route$l.update({
  id: "/messages",
  path: "/messages",
  getParentRoute: () => Route$v
});
const MeRoute = Route$k.update({
  id: "/me",
  path: "/me",
  getParentRoute: () => Route$v
});
const JobsRoute = Route$j.update({
  id: "/jobs",
  path: "/jobs",
  getParentRoute: () => Route$v
});
const GamesRoute = Route$i.update({
  id: "/games",
  path: "/games",
  getParentRoute: () => Route$v
});
const ExploreRoute = Route$h.update({
  id: "/explore",
  path: "/explore",
  getParentRoute: () => Route$v
});
const DiscoverRoute = Route$g.update({
  id: "/discover",
  path: "/discover",
  getParentRoute: () => Route$v
});
const ContestsRoute = Route$f.update({
  id: "/contests",
  path: "/contests",
  getParentRoute: () => Route$v
});
const CommunityRoute = Route$e.update({
  id: "/community",
  path: "/community",
  getParentRoute: () => Route$v
});
const ChatRoute = Route$d.update({
  id: "/chat",
  path: "/chat",
  getParentRoute: () => Route$v
});
const AuthRoute = Route$c.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$v
});
const AdminRoute = Route$b.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$v
});
const AddFriendRoute = Route$a.update({
  id: "/add-friend",
  path: "/add-friend",
  getParentRoute: () => Route$v
});
const IndexRoute = Route$9.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$v
});
const VideosUploadRoute = Route$8.update({
  id: "/upload",
  path: "/upload",
  getParentRoute: () => VideosRoute
});
const MeReportsRoute = Route$7.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => MeRoute
});
const GamesSbtiRoute = Route$6.update({
  id: "/sbti",
  path: "/sbti",
  getParentRoute: () => GamesRoute
});
const GamesPalmRoute = Route$5.update({
  id: "/palm",
  path: "/palm",
  getParentRoute: () => GamesRoute
});
const GamesLeaderboardRoute = Route$4.update({
  id: "/leaderboard",
  path: "/leaderboard",
  getParentRoute: () => GamesRoute
});
const ExploreVoiceRoute = Route$3.update({
  id: "/voice",
  path: "/voice",
  getParentRoute: () => ExploreRoute
});
const ExploreVideoRoute = Route$2.update({
  id: "/video",
  path: "/video",
  getParentRoute: () => ExploreRoute
});
const ExploreTreeholeRoute = Route$1.update({
  id: "/treehole",
  path: "/treehole",
  getParentRoute: () => ExploreRoute
});
const ContestsContestIdRoute = Route2.update({
  id: "/$contestId",
  path: "/$contestId",
  getParentRoute: () => ContestsRoute
});
const ContestsRouteChildren = {
  ContestsContestIdRoute
};
const ContestsRouteWithChildren = ContestsRoute._addFileChildren(
  ContestsRouteChildren
);
const ExploreRouteChildren = {
  ExploreTreeholeRoute,
  ExploreVideoRoute,
  ExploreVoiceRoute
};
const ExploreRouteWithChildren = ExploreRoute._addFileChildren(ExploreRouteChildren);
const GamesRouteChildren = {
  GamesLeaderboardRoute,
  GamesPalmRoute,
  GamesSbtiRoute
};
const GamesRouteWithChildren = GamesRoute._addFileChildren(GamesRouteChildren);
const MeRouteChildren = {
  MeReportsRoute
};
const MeRouteWithChildren = MeRoute._addFileChildren(MeRouteChildren);
const VideosRouteChildren = {
  VideosUploadRoute
};
const VideosRouteWithChildren = VideosRoute._addFileChildren(VideosRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AddFriendRoute,
  AdminRoute,
  AuthRoute,
  ChatRoute,
  CommunityRoute,
  ContestsRoute: ContestsRouteWithChildren,
  DiscoverRoute,
  ExploreRoute: ExploreRouteWithChildren,
  GamesRoute: GamesRouteWithChildren,
  JobsRoute,
  MeRoute: MeRouteWithChildren,
  MessagesRoute,
  NotificationsRoute,
  OnboardingRoute,
  PrivacyRoute,
  RadarRoute,
  VenuesRoute,
  VerifyRoute,
  VideosRoute: VideosRouteWithChildren,
  VoiceCardRoute,
  WalletRoute
};
const routeTree = Route$v._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  ArrowLeft as A,
  Briefcase as B,
  CalendarDays as C,
  timeoutManager as D,
  Events as E,
  toast as F,
  track as G,
  useNavigate as H,
  useQueryClient as I,
  Link as L,
  Moon as M,
  ReactDOM as R,
  Subscribable as S,
  Trophy as T,
  ChevronLeft as a,
  ChevronRight as b,
  Route$e as c,
  Route$d as d,
  Route$c as e,
  Route$a as f,
  Route2 as g,
  analytics as h,
  createLucideIcon as i,
  environmentManager as j,
  fetchState as k,
  focusManager as l,
  getDefaultState as m,
  hashKey as n,
  isValidTimeout as o,
  noop as p,
  notifyManager as q,
  pendingThenable as r,
  reactDomExports as s,
  replaceData as t,
  resolveQueryBoolean as u,
  resolveStaleTime as v,
  router as w,
  shallowEqualObjects as x,
  shouldThrowError as y,
  timeUntilStale as z
};
