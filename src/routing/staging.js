import * as endpoints from '../endpoints/index.js';
import * as sources from '../sources/index.js';

const {
  setSource,
  setDataset,
  setNarrative,
  canonicalizeDataset,
  getDataset,
  putDataset,
  deleteDataset,
  optionsDataset,
  getNarrative,
  putNarrative,
  deleteNarrative,
  optionsNarrative,
} = endpoints.sources;

const {
  CoreStagingSource,
} = sources;


export function setup(app) {
  app.use("/staging", setSource(req => new CoreStagingSource())); // eslint-disable-line no-unused-vars

  app.routeAsync("/staging")
    .getAsync(endpoints.static.sendGatsbyPage("staging/index.html"))
  ;

  app.routeAsync("/staging/narratives")
    .getAsync((req, res) => res.redirect("/staging"));

  app.routeAsync("/staging/narratives/*")
    .all(setNarrative(req => req.params[0]))
    .getAsync(getNarrative)
    .putAsync(putNarrative)
    .deleteAsync(deleteNarrative)
    .optionsAsync(optionsNarrative)
  ;

  app.routeAsync("/staging/*")
    .all(setDataset(req => req.params[0]), canonicalizeDataset(path => `/staging/${path}`))
    .getAsync(getDataset)
    .putAsync(putDataset)
    .deleteAsync(deleteDataset)
    .optionsAsync(optionsDataset)
  ;
}
