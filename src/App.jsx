import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(cat => cat.id === product.categoryId);
  const user = usersFromServer.find(curUser => curUser.id === category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

const filterProducts = (userActive, catActive, query) => {
  let allProd = [...products];

  if (userActive) {
    if (userActive === 'All') {
      allProd = [...products];
    } else {
      allProd = allProd.filter(prod => prod.user.name === userActive);
    }
  }

  if (catActive.length) {
    allProd = allProd.filter(prod => catActive.includes(prod.category.title));
  }

  if (query) {
    allProd = allProd.filter(prod => prod.name.toLowerCase()
      .includes(query.toLowerCase()));
  }

  return allProd;
};

export const App = () => {
  const [userActive, setUserActive] = useState('All');
  const [catActive, setCatActive] = useState([]);
  const [query, setQuery] = useState('');

  const allProduct = filterProducts(userActive, catActive, query);

  const checkCatActive = (name) => {
    if (catActive.includes(name)) {
      setCatActive(catActive.filter(cat => cat.name === name));
    } else {
      setCatActive([...catActive, name]);
    }
  };

  const resetAll = () => {
    setUserActive('All');
    setCatActive([]);
    setQuery('');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>
        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({ 'is-active': userActive === 'All' })}
                onClick={() => setUserActive('All')}
              >
                All
              </a>
              {
                usersFromServer.map(user => (
                  <a
                    key={user.id}
                    data-cy="FilterUser"
                    href="#/"
                    className={cn({ 'is-active': userActive === user.name })}
                    onClick={() => setUserActive(user.name)}
                  >
                    {user.name}
                  </a>
                ))
              }
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {
                    query
                    && (
                      <button
                        data-cy="ClearButton"
                        type="button"
                        className="delete"
                        onClick={() => setQuery('')}
                      />
                    )
                  }

                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                onClick={() => {
                  setCatActive([]);
                }}
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>
              {
                categoriesFromServer.map(cat => (
                  <a
                    key={cat.id}
                    data-cy="Category"
                    className={cn('button', 'mr-2', 'my-1',
                      { 'is-info': catActive.includes(cat.title) })}
                    href="#/"
                    onClick={() => checkCatActive(cat.title)}
                  >
                    {cat.title}
                  </a>
                ))
              }
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetAll}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!allProduct.length
            && (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )
          }
          {allProduct.length !== 0
            && (
              <table
                data-cy="ProductTable"
                className="table is-striped is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        ID
                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Product

                        <a href="#/">
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className="fas fa-sort-down"
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Category

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort-up" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {allProduct.map((prod) => {
                    const classLink = prod.user.sex === 'm'
                      ? 'has-text-link'
                      : 'has-text-danger';

                    return (
                      <tr key={prod.id} data-cy="Product">
                        <td
                          className="has-text-weight-bold"
                          data-cy="ProductId"
                        >
                          {prod.id}
                        </td>

                        <td data-cy="ProductName">{prod.name}</td>
                        <td data-cy="ProductCategory">{`${prod.category.icon} - ${prod.category.title}`}</td>

                        <td
                          data-cy="ProductUser"
                          className={classLink}
                        >
                          {prod.user.name}
                        </td>
                      </tr>
                    );
                  })
                  }
                </tbody>
              </table>
            )
          }
        </div>
      </div>
    </div>
  );
};
