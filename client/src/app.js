import page from '//unpkg.com/page/page.mjs';

import { onRenderContent } from './middlewears/renderContent.js';
import { setActiveNav } from './middlewears/activeNav.js';
import { getUser } from './util/util.js';
import { roleAssignment } from './util/role.js';

// Pages
import { homePage } from './views/home.js';
import { containersShapePage } from './views/catalog/containersShape.js';
import { handlesCatalogPage } from './views/catalog/handlesCatalog.js';
import { lidsShapePage } from './views/catalog/lidsShape.js';
import { immCatalogPage } from './views/catalog/immCatalog.js';
import { detailsPage } from './views/details/details.js';
import { createItemPage } from './views/create/createItem.js';
import { createMoldPage } from './views/create/createMold.js';
import { createImmPage } from './views/create/createImm.js';
import { itemDetailsPage } from './views/details/itemDetails.js';
import { moldDetailsPage } from './views/details/moldDetails.js';
import { immDetailsPage } from './views/details/immDetails.js';
import { editItemPage } from './views/edit/editItem.js';
import { editMoldPage } from './views/edit/editMold.js'
import { editImmPage } from './views/edit/editImm.js'
import { loginPage, onLogout } from './views/auth/login.js';
import { registerPage } from './views/auth/register.js';
import { forgotPassPage } from './views/auth/forgotPass.js';
import { renewPassPage } from './views/auth/renewPass.js';
import { profilePage } from './views/auth/profile.js';
import { editProfilePage } from './views/edit/editProfile.js';
import { changePassPage } from './views/auth/changePasswordPage.js'
import { notFoundPage } from './views/404.js';
import { searchItemPage } from './views/search/searchItem.js';
import { searchImmPage } from './views/search/searchImm.js';
import { contactPage } from './views/contacts.js';
import { containersCatalogPage } from './views/catalog/containersCatalog.js';
import { lidsCatalogPage } from './views/catalog/lidsCatalog.js';
import { optionPage } from './views/create/createOption.js';

page(onRenderContent);

page((ctx, next) => {ctx.updateNav = updateNav, next()});
page((ctx, next) => {setActiveNav(ctx.path), next()});
page('/index.html', '/');
page('/', homePage);
page('/register', registerPage);
page('/login', loginPage);
page('/logout', onLogout);
page('/containers-shape', containersShapePage);
page('/lids-shape', lidsShapePage);
page('/containers-catalog/:shape', containersCatalogPage);
page('/lids-catalog/:shape', lidsCatalogPage);
page('/handles-catalog', handlesCatalogPage);
page('/imms-catalog', immCatalogPage);
page('/create-item', createItemPage);
page('/create-mold', createMoldPage);
page('/create-imm', createImmPage);
page('/item-details/:itemId', itemDetailsPage);
page('/details/:itemId', detailsPage);
page('/item-options/:itemId', optionPage);
page('/mold-details/:itemId', moldDetailsPage);
page('/imm-details/:immId', immDetailsPage);
page('/edit-item/:itemId', editItemPage);
page('/edit-mold/:moldId', editMoldPage);
page('/edit-imm/:immId', editImmPage);
page('/forgot', forgotPassPage);
page('/renew/:token', renewPassPage);
// page('/verify-email/:token', '');
page('/profile', profilePage);
page('/edit-profile', editProfilePage);
page('/chg-pass', changePassPage);
page('/searchItem', searchItemPage);
page('/searchImm', searchImmPage);
page('/contacts', contactPage);
page('*', notFoundPage);

page();

updateNav();

function updateNav() {
    const user = getUser();
    const aIpoma = document.getElementById('prof');
    const aUser = document.getElementById('prof1');
    const ipomaArr = Array.from(document.querySelectorAll('.ipoma'));
    const userArr = Array.from(document.querySelectorAll('.user'));
    const guest = document.querySelectorAll('.guest');
    const currentUser = roleAssignment(user);

    function guestAcc() {
        ipomaArr.forEach(element => {
            element.style.display = 'none';
        })

        userArr.forEach(element => {
            element.style.display = 'none';
        })

        guest.forEach(element => {
            element.style.display = 'block';
        })
    }

    function userAcc() {
        ipomaArr.forEach(element => {
            element.style.display = 'none';
        })
        
        userArr.forEach(element => {
            element.style.display = 'block';
        })

        guest.forEach(element => {
            element.style.display = 'none';
        })

        aUser.textContent = `Welcome ${user.username}`;
    }

    function ipomaAcc() {
        ipomaArr.forEach(element => {
            element.style.display = 'block';
        })

        userArr.forEach(element => {
            element.style.display = 'none';
        })

        guest.forEach(element => {
            element.style.display = 'none';
        })

        aIpoma.textContent = `Welcome ${user.username}`;
    }

    const action = {
        'ipoma-user': () => ipomaAcc(),
        'admin': () => ipomaAcc(),
        'user': () => userAcc(),
        'guest': () => guestAcc()
    }

    action[currentUser.role]?.();
}